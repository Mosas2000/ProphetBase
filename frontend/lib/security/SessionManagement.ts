export interface Session {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  location?: string;
  userAgent: string;
  createdAt: number;
  lastActivity: number;
  expiresAt: number;
  status: 'active' | 'expired' | 'terminated';
}

export interface SessionActivity {
  sessionId: string;
  action: string;
  timestamp: number;
  details?: string;
}

export class SessionManagementSystem {
  private sessions: Map<string, Session> = new Map();
  private activities: SessionActivity[] = [];
  private readonly SESSION_TIMEOUT = 3600000;
  private readonly MAX_CONCURRENT_SESSIONS = 5;

  createSession(
    userId: string,
    deviceId: string,
    deviceName: string,
    ipAddress: string,
    userAgent: string,
    location?: string
  ): Session | { error: string } {
    const activeSessions = this.getActiveSessions(userId);

    if (activeSessions.length >= this.MAX_CONCURRENT_SESSIONS) {
      return { error: 'Maximum concurrent sessions reached' };
    }

    const session: Session = {
      id: this.generateSessionId(),
      userId,
      deviceId,
      deviceName,
      ipAddress,
      location,
      userAgent,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      expiresAt: Date.now() + this.SESSION_TIMEOUT,
      status: 'active',
    };

    this.sessions.set(session.id, session);
    this.logActivity(session.id, 'session_created');

    return session;
  }

  private generateSessionId(): string {
    const bytes = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(bytes);
    }
    return (
      'ses_' +
      Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    );
  }

  validateSession(sessionId: string): {
    valid: boolean;
    session?: Session;
    error?: string;
  } {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return { valid: false, error: 'Session not found' };
    }

    if (session.status !== 'active') {
      return { valid: false, error: `Session is ${session.status}` };
    }

    if (Date.now() > session.expiresAt) {
      session.status = 'expired';
      this.logActivity(sessionId, 'session_expired');
      return { valid: false, error: 'Session expired' };
    }

    return { valid: true, session };
  }

  updateSessionActivity(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);

    if (session && session.status === 'active') {
      session.lastActivity = Date.now();
      session.expiresAt = Date.now() + this.SESSION_TIMEOUT;
      return true;
    }

    return false;
  }

  terminateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);

    if (session) {
      session.status = 'terminated';
      this.logActivity(sessionId, 'session_terminated');
      return true;
    }

    return false;
  }

  terminateAllSessions(userId: string, exceptSessionId?: string): number {
    let terminated = 0;

    for (const session of this.sessions.values()) {
      if (
        session.userId === userId &&
        session.id !== exceptSessionId &&
        session.status === 'active'
      ) {
        session.status = 'terminated';
        this.logActivity(session.id, 'session_terminated_by_user');
        terminated++;
      }
    }

    return terminated;
  }

  getActiveSessions(userId: string): Session[] {
    return Array.from(this.sessions.values())
      .filter((s) => s.userId === userId && s.status === 'active')
      .sort((a, b) => b.lastActivity - a.lastActivity);
  }

  getSessionDetails(sessionId: string): Session | null {
    return this.sessions.get(sessionId) || null;
  }

  getSessionActivities(
    sessionId: string,
    limit: number = 50
  ): SessionActivity[] {
    return this.activities
      .filter((a) => a.sessionId === sessionId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  private logActivity(
    sessionId: string,
    action: string,
    details?: string
  ): void {
    this.activities.push({
      sessionId,
      action,
      timestamp: Date.now(),
      details,
    });

    if (this.activities.length > 10000) {
      this.activities = this.activities.slice(-5000);
    }
  }

  setConcurrentSessionLimit(userId: string, limit: number): void {}

  getConcurrentSessionLimit(userId: string): number {
    return this.MAX_CONCURRENT_SESSIONS;
  }

  extendSession(sessionId: string, additionalTime: number): boolean {
    const session = this.sessions.get(sessionId);

    if (session && session.status === 'active') {
      session.expiresAt += additionalTime;
      this.logActivity(
        sessionId,
        'session_extended',
        `Extended by ${additionalTime}ms`
      );
      return true;
    }

    return false;
  }

  getSessionStatistics(userId: string): {
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
    terminatedSessions: number;
    averageSessionDuration: number;
  } {
    const userSessions = Array.from(this.sessions.values()).filter(
      (s) => s.userId === userId
    );

    const totalSessions = userSessions.length;
    const activeSessions = userSessions.filter(
      (s) => s.status === 'active'
    ).length;
    const expiredSessions = userSessions.filter(
      (s) => s.status === 'expired'
    ).length;
    const terminatedSessions = userSessions.filter(
      (s) => s.status === 'terminated'
    ).length;

    const durations = userSessions
      .filter((s) => s.status !== 'active')
      .map((s) => {
        const endTime = s.status === 'expired' ? s.expiresAt : s.lastActivity;
        return endTime - s.createdAt;
      });

    const averageSessionDuration =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;

    return {
      totalSessions,
      activeSessions,
      expiredSessions,
      terminatedSessions,
      averageSessionDuration,
    };
  }

  cleanupExpiredSessions(): number {
    let cleaned = 0;
    const now = Date.now();

    for (const session of this.sessions.values()) {
      if (session.status === 'active' && session.expiresAt < now) {
        session.status = 'expired';
        cleaned++;
      }
    }

    return cleaned;
  }

  getSuspiciousSessions(userId: string): Session[] {
    const activeSessions = this.getActiveSessions(userId);
    const suspicious: Session[] = [];

    const locations = new Set(
      activeSessions.map((s) => s.location).filter(Boolean)
    );
    if (locations.size > 2) {
      suspicious.push(...activeSessions);
    }

    const now = Date.now();
    activeSessions.forEach((session) => {
      if (now - session.lastActivity > 3600000 * 6) {
        suspicious.push(session);
      }
    });

    return Array.from(new Set(suspicious));
  }

  getSessionByDevice(userId: string, deviceId: string): Session | null {
    const sessions = Array.from(this.sessions.values()).filter(
      (s) =>
        s.userId === userId && s.deviceId === deviceId && s.status === 'active'
    );

    return sessions.length > 0 ? sessions[0] : null;
  }
}
