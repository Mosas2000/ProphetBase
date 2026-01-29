import * as crypto from 'crypto';

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  authTag: string;
  algorithm: string;
}

export interface EncryptionKey {
  id: string;
  userId: string;
  key: string;
  createdAt: number;
  rotatedAt?: number;
  status: 'active' | 'archived';
}

export class DataEncryptionService {
  private keys: Map<string, EncryptionKey> = new Map();
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly KEY_LENGTH = 32;
  private readonly IV_LENGTH = 16;

  generateEncryptionKey(userId: string): EncryptionKey {
    const keyBuffer = crypto.randomBytes(this.KEY_LENGTH);
    const key: EncryptionKey = {
      id: this.generateKeyId(),
      userId,
      key: keyBuffer.toString('hex'),
      createdAt: Date.now(),
      status: 'active',
    };

    this.keys.set(key.id, key);
    return key;
  }

  private generateKeyId(): string {
    return 'key_' + crypto.randomBytes(16).toString('hex');
  }

  encrypt(data: string, keyId: string): EncryptedData {
    const key = this.keys.get(keyId);

    if (!key || key.status !== 'active') {
      throw new Error('Invalid or inactive encryption key');
    }

    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      this.ALGORITHM,
      Buffer.from(key.key, 'hex'),
      iv
    );

    let ciphertext = cipher.update(data, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      ciphertext,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: this.ALGORITHM,
    };
  }

  decrypt(encryptedData: EncryptedData, keyId: string): string {
    const key = this.keys.get(keyId);

    if (!key) {
      throw new Error('Encryption key not found');
    }

    const decipher = crypto.createDecipheriv(
      encryptedData.algorithm,
      Buffer.from(key.key, 'hex'),
      Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let plaintext = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');

    return plaintext;
  }

  encryptAPIKey(apiKey: string, keyId: string): EncryptedData {
    return this.encrypt(apiKey, keyId);
  }

  decryptAPIKey(encryptedData: EncryptedData, keyId: string): string {
    return this.decrypt(encryptedData, keyId);
  }

  encryptPrivateNote(note: string, keyId: string): EncryptedData {
    return this.encrypt(note, keyId);
  }

  decryptPrivateNote(encryptedData: EncryptedData, keyId: string): string {
    return this.decrypt(encryptedData, keyId);
  }

  encryptPersonalInfo(info: Record<string, any>, keyId: string): EncryptedData {
    const jsonString = JSON.stringify(info);
    return this.encrypt(jsonString, keyId);
  }

  decryptPersonalInfo(
    encryptedData: EncryptedData,
    keyId: string
  ): Record<string, any> {
    const decrypted = this.decrypt(encryptedData, keyId);
    return JSON.parse(decrypted);
  }

  rotateKey(
    oldKeyId: string,
    userId: string
  ): { oldKey: EncryptionKey; newKey: EncryptionKey } {
    const oldKey = this.keys.get(oldKeyId);

    if (!oldKey || oldKey.userId !== userId) {
      throw new Error('Invalid key or unauthorized');
    }

    oldKey.status = 'archived';
    oldKey.rotatedAt = Date.now();

    const newKey = this.generateEncryptionKey(userId);

    return { oldKey, newKey };
  }

  reencryptData(
    encryptedData: EncryptedData,
    oldKeyId: string,
    newKeyId: string
  ): EncryptedData {
    const plaintext = this.decrypt(encryptedData, oldKeyId);
    return this.encrypt(plaintext, newKeyId);
  }

  getUserKeys(userId: string): EncryptionKey[] {
    return Array.from(this.keys.values())
      .filter((key) => key.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  getActiveKey(userId: string): EncryptionKey | null {
    const keys = this.getUserKeys(userId);
    return keys.find((key) => key.status === 'active') || null;
  }

  archiveKey(keyId: string): boolean {
    const key = this.keys.get(keyId);

    if (key && key.status === 'active') {
      key.status = 'archived';
      key.rotatedAt = Date.now();
      return true;
    }

    return false;
  }

  deleteKey(keyId: string, userId: string): boolean {
    const key = this.keys.get(keyId);

    if (key && key.userId === userId && key.status === 'archived') {
      return this.keys.delete(keyId);
    }

    return false;
  }

  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    return `${salt}:${hash}`;
  }

  verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    const verifyHash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    return hash === verifyHash;
  }

  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  encryptField(value: string, keyId: string): string {
    const encrypted = this.encrypt(value, keyId);
    return JSON.stringify(encrypted);
  }

  decryptField(encryptedValue: string, keyId: string): string {
    const encrypted: EncryptedData = JSON.parse(encryptedValue);
    return this.decrypt(encrypted, keyId);
  }

  bulkEncrypt(
    data: Record<string, string>,
    keyId: string
  ): Record<string, EncryptedData> {
    const encrypted: Record<string, EncryptedData> = {};

    for (const [key, value] of Object.entries(data)) {
      encrypted[key] = this.encrypt(value, keyId);
    }

    return encrypted;
  }

  bulkDecrypt(
    encryptedData: Record<string, EncryptedData>,
    keyId: string
  ): Record<string, string> {
    const decrypted: Record<string, string> = {};

    for (const [key, value] of Object.entries(encryptedData)) {
      decrypted[key] = this.decrypt(value, keyId);
    }

    return decrypted;
  }

  getKeyStatistics(userId: string): {
    totalKeys: number;
    activeKeys: number;
    archivedKeys: number;
    oldestKey: number;
    newestKey: number;
  } {
    const userKeys = this.getUserKeys(userId);

    return {
      totalKeys: userKeys.length,
      activeKeys: userKeys.filter((k) => k.status === 'active').length,
      archivedKeys: userKeys.filter((k) => k.status === 'archived').length,
      oldestKey:
        userKeys.length > 0 ? Math.min(...userKeys.map((k) => k.createdAt)) : 0,
      newestKey:
        userKeys.length > 0 ? Math.max(...userKeys.map((k) => k.createdAt)) : 0,
    };
  }
}
