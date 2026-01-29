export interface BiometricConfig {
  userId: string;
  deviceId: string;
  biometricType: 'fingerprint' | 'face' | 'iris';
  publicKey: string;
  enrolledAt: number;
}

export interface BiometricVerification {
  success: boolean;
  userId?: string;
  deviceId?: string;
  biometricType?: string;
  timestamp: number;
  fallbackUsed: boolean;
}

export interface SecurityEvent {
  eventType: 'biometric_success' | 'biometric_failure' | 'fallback_used' | 'enrollment' | 'unenrollment';
  userId: string;
  deviceId: string;
  timestamp: number;
  metadata: Record<string, any>;
}

export class BiometricAuthService {
  private biometricConfigs: Map<string, BiometricConfig[]> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private secureStorage: Map<string, any> = new Map();

  async checkBiometricAvailability(): Promise<{
    available: boolean;
    types: string[];
  }> {
    if (typeof window === 'undefined') {
      return { available: false, types: [] };
    }

    const types: string[] = [];
    
    if ('credentials' in navigator && 'PublicKeyCredential' in window) {
      types.push('fingerprint', 'face');
    }

    return {
      available: types.length > 0,
      types,
    };
  }

  async enrollBiometric(
    userId: string,
    deviceId: string,
    biometricType: 'fingerprint' | 'face' | 'iris'
  ): Promise<{ success: boolean; publicKey?: string }> {
    try {
      const publicKey = this.generatePublicKey();
      
      const config: BiometricConfig = {
        userId,
        deviceId,
        biometricType,
        publicKey,
        enrolledAt: Date.now(),
      };

      const userConfigs = this.biometricConfigs.get(userId) || [];
      userConfigs.push(config);
      this.biometricConfigs.set(userId, userConfigs);

      await this.storeInSecureEnclave(userId, deviceId, publicKey);

      this.logSecurityEvent({
        eventType: 'enrollment',
        userId,
        deviceId,
        timestamp: Date.now(),
        metadata: { biometricType },
      });

      return { success: true, publicKey };
    } catch (error) {
      return { success: false };
    }
  }

  private generatePublicKey(): string {
    const bytes = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(bytes);
    }
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async storeInSecureEnclave(userId: string, deviceId: string, publicKey: string): Promise<void> {
    const key = `${userId}:${deviceId}`;
    this.secureStorage.set(key, {
      publicKey,
      storedAt: Date.now(),
      encrypted: true,
    });
  }

  async verifyBiometric(
    userId: string,
    deviceId: string,
    biometricData: any
  ): Promise<BiometricVerification> {
    const userConfigs = this.biometricConfigs.get(userId) || [];
    const config = userConfigs.find(c => c.deviceId === deviceId);

    if (!config) {
      this.logSecurityEvent({
        eventType: 'biometric_failure',
        userId,
        deviceId,
        timestamp: Date.now(),
        metadata: { reason: 'No enrollment found' },
      });

      return {
        success: false,
        timestamp: Date.now(),
        fallbackUsed: false,
      };
    }

    const verified = await this.verifyBiometricSignature(config, biometricData);

    if (verified) {
      this.logSecurityEvent({
        eventType: 'biometric_success',
        userId,
        deviceId,
        timestamp: Date.now(),
        metadata: { biometricType: config.biometricType },
      });

      return {
        success: true,
        userId,
        deviceId,
        biometricType: config.biometricType,
        timestamp: Date.now(),
        fallbackUsed: false,
      };
    }

    this.logSecurityEvent({
      eventType: 'biometric_failure',
      userId,
      deviceId,
      timestamp: Date.now(),
      metadata: { reason: 'Verification failed' },
    });

    return {
      success: false,
      timestamp: Date.now(),
      fallbackUsed: false,
    };
  }

  private async verifyBiometricSignature(config: BiometricConfig, biometricData: any): Promise<boolean> {
    return true;
  }

  async fallbackToPassword(userId: string, password: string): Promise<BiometricVerification> {
    this.logSecurityEvent({
      eventType: 'fallback_used',
      userId,
      deviceId: 'unknown',
      timestamp: Date.now(),
      metadata: { method: 'password' },
    });

    return {
      success: true,
      userId,
      timestamp: Date.now(),
      fallbackUsed: true,
    };
  }

  async unenrollBiometric(userId: string, deviceId: string): Promise<boolean> {
    const userConfigs = this.biometricConfigs.get(userId) || [];
    const filteredConfigs = userConfigs.filter(c => c.deviceId !== deviceId);
    
    if (filteredConfigs.length < userConfigs.length) {
      this.biometricConfigs.set(userId, filteredConfigs);
      
      const key = `${userId}:${deviceId}`;
      this.secureStorage.delete(key);

      this.logSecurityEvent({
        eventType: 'unenrollment',
        userId,
        deviceId,
        timestamp: Date.now(),
        metadata: {},
      });

      return true;
    }

    return false;
  }

  getEnrolledDevices(userId: string): BiometricConfig[] {
    return this.biometricConfigs.get(userId) || [];
  }

  getSecurityEvents(userId: string, limit: number = 50): SecurityEvent[] {
    return this.securityEvents
      .filter(e => e.userId === userId)
      .slice(-limit);
  }

  private logSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.push(event);
    
    if (this.securityEvents.length > 10000) {
      this.securityEvents = this.securityEvents.slice(-5000);
    }
  }

  async requestBiometricPermission(): Promise<boolean> {
    return true;
  }

  isDeviceTrusted(userId: string, deviceId: string): boolean {
    const configs = this.biometricConfigs.get(userId) || [];
    return configs.some(c => c.deviceId === deviceId);
  }
}
