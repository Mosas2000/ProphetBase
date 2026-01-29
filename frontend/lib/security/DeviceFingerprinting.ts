import * as crypto from 'crypto';

export interface DeviceFingerprint {
  deviceId: string;
  userId: string;
  fingerprint: string;
  trustScore: number;
  firstSeen: number;
  lastSeen: number;
  loginCount: number;
  failedLoginAttempts: number;
  metadata: {
    userAgent: string;
    platform: string;
    screenResolution: string;
    timezone: string;
    language: string;
    plugins: string[];
    fonts: string[];
    canvas: string;
    webgl: string;
  };
  loginPattern: {
    averageLoginTime: number;
    loginHours: number[];
    typicalLocations: string[];
  };
  riskFactors: string[];
  verified: boolean;
}

export interface SuspiciousActivity {
  deviceId: string;
  activityType: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  details: string;
}

export class DeviceFingerprintingService {
  private devices: Map<string, DeviceFingerprint> = new Map();
  private suspiciousActivities: SuspiciousActivity[] = [];

  generateFingerprint(deviceInfo: any): string {
    const fingerprintData = [
      deviceInfo.userAgent || '',
      deviceInfo.platform || '',
      deviceInfo.screenResolution || '',
      deviceInfo.timezone || '',
      deviceInfo.language || '',
      (deviceInfo.plugins || []).join(','),
      (deviceInfo.fonts || []).join(','),
      deviceInfo.canvas || '',
      deviceInfo.webgl || '',
    ].join('|');

    return crypto.createHash('sha256').update(fingerprintData).digest('hex');
  }

  registerDevice(userId: string, deviceInfo: any): DeviceFingerprint {
    const fingerprint = this.generateFingerprint(deviceInfo);
    const deviceId = 'dev_' + crypto.randomBytes(16).toString('hex');

    const device: DeviceFingerprint = {
      deviceId,
      userId,
      fingerprint,
      trustScore: 0.5,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      loginCount: 1,
      failedLoginAttempts: 0,
      metadata: {
        userAgent: deviceInfo.userAgent || '',
        platform: deviceInfo.platform || '',
        screenResolution: deviceInfo.screenResolution || '',
        timezone: deviceInfo.timezone || '',
        language: deviceInfo.language || '',
        plugins: deviceInfo.plugins || [],
        fonts: deviceInfo.fonts || [],
        canvas: deviceInfo.canvas || '',
        webgl: deviceInfo.webgl || '',
      },
      loginPattern: {
        averageLoginTime: new Date().getHours(),
        loginHours: [new Date().getHours()],
        typicalLocations: [],
      },
      riskFactors: [],
      verified: false,
    };

    this.devices.set(deviceId, device);
    return device;
  }

  identifyDevice(deviceInfo: any): DeviceFingerprint | null {
    const fingerprint = this.generateFingerprint(deviceInfo);

    for (const device of this.devices.values()) {
      if (device.fingerprint === fingerprint) {
        return device;
      }
    }

    return null;
  }

  updateDeviceOnLogin(
    deviceId: string,
    success: boolean,
    location?: string
  ): void {
    const device = this.devices.get(deviceId);
    if (!device) return;

    device.lastSeen = Date.now();

    if (success) {
      device.loginCount++;
      device.failedLoginAttempts = 0;

      const currentHour = new Date().getHours();
      device.loginPattern.loginHours.push(currentHour);

      if (
        location &&
        !device.loginPattern.typicalLocations.includes(location)
      ) {
        device.loginPattern.typicalLocations.push(location);
      }

      this.adjustTrustScore(device, 'successful_login');
    } else {
      device.failedLoginAttempts++;
      this.adjustTrustScore(device, 'failed_login');

      if (device.failedLoginAttempts >= 3) {
        this.flagSuspiciousActivity(
          deviceId,
          'multiple_failed_logins',
          'high',
          `${device.failedLoginAttempts} consecutive failed login attempts`
        );
      }
    }
  }

  calculateTrustScore(device: DeviceFingerprint): number {
    let score = 0.5;

    const daysSinceFirstSeen = (Date.now() - device.firstSeen) / 86400000;
    if (daysSinceFirstSeen > 30) score += 0.2;
    else if (daysSinceFirstSeen > 7) score += 0.1;

    if (device.loginCount > 50) score += 0.15;
    else if (device.loginCount > 10) score += 0.1;
    else if (device.loginCount > 5) score += 0.05;

    if (device.failedLoginAttempts === 0) score += 0.1;
    else if (device.failedLoginAttempts > 5) score -= 0.2;

    if (device.verified) score += 0.15;

    score -= device.riskFactors.length * 0.05;

    return Math.max(0, Math.min(1, score));
  }

  private adjustTrustScore(device: DeviceFingerprint, event: string): void {
    const adjustments: Record<string, number> = {
      successful_login: 0.01,
      failed_login: -0.05,
      suspicious_activity: -0.15,
      verification_completed: 0.2,
    };

    const adjustment = adjustments[event] || 0;
    device.trustScore = Math.max(
      0,
      Math.min(1, device.trustScore + adjustment)
    );
  }

  analyzeDevicePattern(
    deviceId: string,
    currentActivity: any
  ): {
    isAnomalous: boolean;
    anomalies: string[];
    riskLevel: 'low' | 'medium' | 'high';
  } {
    const device = this.devices.get(deviceId);
    if (!device) {
      return {
        isAnomalous: true,
        anomalies: ['Unknown device'],
        riskLevel: 'high',
      };
    }

    const anomalies: string[] = [];

    const currentHour = new Date().getHours();
    const typicalHours = new Set(device.loginPattern.loginHours);
    if (!typicalHours.has(currentHour) && device.loginCount > 10) {
      anomalies.push('Unusual login time');
    }

    if (
      currentActivity.location &&
      device.loginPattern.typicalLocations.length > 0
    ) {
      if (
        !device.loginPattern.typicalLocations.includes(currentActivity.location)
      ) {
        anomalies.push('New location');
      }
    }

    if (device.trustScore < 0.3) {
      anomalies.push('Low trust score');
    }

    if (device.failedLoginAttempts > 2) {
      anomalies.push('Recent failed login attempts');
    }

    const isAnomalous = anomalies.length > 0;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    if (anomalies.length >= 3 || device.trustScore < 0.2) {
      riskLevel = 'high';
    } else if (anomalies.length >= 2 || device.trustScore < 0.5) {
      riskLevel = 'medium';
    }

    return { isAnomalous, anomalies, riskLevel };
  }

  requireAdditionalVerification(deviceId: string): boolean {
    const device = this.devices.get(deviceId);
    if (!device) return true;

    if (device.trustScore < 0.5) return true;
    if (!device.verified) return true;
    if (device.failedLoginAttempts > 0) return true;

    const daysSinceLastSeen = (Date.now() - device.lastSeen) / 86400000;
    if (daysSinceLastSeen > 30) return true;

    return false;
  }

  flagSuspiciousActivity(
    deviceId: string,
    activityType: string,
    severity: 'low' | 'medium' | 'high',
    details: string
  ): void {
    this.suspiciousActivities.push({
      deviceId,
      activityType,
      severity,
      timestamp: Date.now(),
      details,
    });

    const device = this.devices.get(deviceId);
    if (device) {
      if (!device.riskFactors.includes(activityType)) {
        device.riskFactors.push(activityType);
      }
      this.adjustTrustScore(device, 'suspicious_activity');
    }
  }

  verifyDevice(deviceId: string): boolean {
    const device = this.devices.get(deviceId);
    if (device) {
      device.verified = true;
      this.adjustTrustScore(device, 'verification_completed');
      return true;
    }
    return false;
  }

  getUserDevices(userId: string): DeviceFingerprint[] {
    return Array.from(this.devices.values())
      .filter((d) => d.userId === userId)
      .sort((a, b) => b.lastSeen - a.lastSeen);
  }

  getSuspiciousActivities(deviceId: string): SuspiciousActivity[] {
    return this.suspiciousActivities.filter((a) => a.deviceId === deviceId);
  }

  removeDevice(deviceId: string): boolean {
    return this.devices.delete(deviceId);
  }

  getDeviceStatistics(userId: string): {
    totalDevices: number;
    verifiedDevices: number;
    averageTrustScore: number;
    suspiciousDevices: number;
  } {
    const userDevices = this.getUserDevices(userId);

    return {
      totalDevices: userDevices.length,
      verifiedDevices: userDevices.filter((d) => d.verified).length,
      averageTrustScore:
        userDevices.reduce((sum, d) => sum + d.trustScore, 0) /
          userDevices.length || 0,
      suspiciousDevices: userDevices.filter((d) => d.trustScore < 0.3).length,
    };
  }
}
