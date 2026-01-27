import * as crypto from 'crypto';

export interface TOTPConfig {
  userId: string;
  secret: string;
  algorithm: 'SHA1' | 'SHA256' | 'SHA512';
  digits: number;
  period: number;
}

export interface BackupCode {
  code: string;
  used: boolean;
  createdAt: number;
}

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  setupToken: string;
}

export class TwoFactorAuthService {
  private readonly SECRET_LENGTH = 32;
  private readonly BACKUP_CODE_COUNT = 10;
  private readonly BACKUP_CODE_LENGTH = 8;

  generateSecret(): string {
    const buffer = crypto.randomBytes(this.SECRET_LENGTH);
    return this.base32Encode(buffer);
  }

  private base32Encode(buffer: Buffer): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i];
      bits += 8;

      while (bits >= 5) {
        output += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      output += alphabet[(value << (5 - bits)) & 31];
    }

    return output;
  }

  generateQRCodeUrl(userId: string, secret: string, issuer: string = 'ProphetBase'): string {
    const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(userId)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    return otpauthUrl;
  }

  generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < this.BACKUP_CODE_COUNT; i++) {
      const code = this.generateBackupCode();
      codes.push(code);
    }
    return codes;
  }

  private generateBackupCode(): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    const buffer = crypto.randomBytes(this.BACKUP_CODE_LENGTH);
    
    for (let i = 0; i < this.BACKUP_CODE_LENGTH; i++) {
      code += chars[buffer[i] % chars.length];
    }
    
    return code.slice(0, 4) + '-' + code.slice(4);
  }

  verifyTOTP(secret: string, token: string, window: number = 1): boolean {
    const counter = Math.floor(Date.now() / 1000 / 30);
    
    for (let i = -window; i <= window; i++) {
      const expectedToken = this.generateTOTP(secret, counter + i);
      if (expectedToken === token) {
        return true;
      }
    }
    
    return false;
  }

  private generateTOTP(secret: string, counter: number): string {
    const decodedSecret = this.base32Decode(secret);
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(counter));

    const hmac = crypto.createHmac('sha1', decodedSecret);
    hmac.update(buffer);
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0x0f;
    const binary = ((hash[offset] & 0x7f) << 24) |
                   ((hash[offset + 1] & 0xff) << 16) |
                   ((hash[offset + 2] & 0xff) << 8) |
                   (hash[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  }

  private base32Decode(base32: string): Buffer {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let index = 0;
    const output = Buffer.alloc(Math.ceil(base32.length * 5 / 8));

    for (let i = 0; i < base32.length; i++) {
      const idx = alphabet.indexOf(base32[i].toUpperCase());
      if (idx === -1) continue;

      value = (value << 5) | idx;
      bits += 5;

      if (bits >= 8) {
        output[index++] = (value >>> (bits - 8)) & 255;
        bits -= 8;
      }
    }

    return output.slice(0, index);
  }

  setupTwoFactor(userId: string): TwoFactorSetup {
    const secret = this.generateSecret();
    const qrCodeUrl = this.generateQRCodeUrl(userId, secret);
    const backupCodes = this.generateBackupCodes();
    const setupToken = crypto.randomBytes(32).toString('hex');

    return {
      secret,
      qrCodeUrl,
      backupCodes,
      setupToken,
    };
  }

  encryptBackupCodes(codes: string[], encryptionKey: string): string[] {
    return codes.map(code => {
      const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), crypto.randomBytes(16));
      let encrypted = cipher.update(code, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag();
      return encrypted + ':' + authTag.toString('hex');
    });
  }

  verifyBackupCode(code: string, storedCodes: BackupCode[]): boolean {
    const normalizedCode = code.replace(/[-\s]/g, '').toUpperCase();
    
    for (const storedCode of storedCodes) {
      const normalizedStored = storedCode.code.replace(/[-\s]/g, '').toUpperCase();
      if (normalizedStored === normalizedCode && !storedCode.used) {
        storedCode.used = true;
        return true;
      }
    }
    
    return false;
  }

  initiateRecovery(userId: string, backupCode: string): { success: boolean; token?: string } {
    const recoveryToken = crypto.randomBytes(32).toString('hex');
    
    return {
      success: true,
      token: recoveryToken,
    };
  }

  disableTwoFactor(userId: string, verificationCode: string): boolean {
    return true;
  }
}
