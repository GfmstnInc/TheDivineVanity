import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { SECURITY_CONFIG, UserRole } from './security';
import { logSecurityEvent } from './securityMiddleware';

// Enhanced JWT Token Management
interface JWTPayload {
  userId: string;
  role: UserRole;
  sessionId: string;
  iat: number;
  exp: number;
}

export class AuthenticationSecurity {
  private static readonly TOKEN_EXPIRY = 24 * 60 * 60; // 24 hours
  private static readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days
  private static activeSessions = new Map<string, Set<string>>(); // userId -> sessionIds
  private static tokenBlacklist = new Set<string>();

  // Generate secure session ID
  static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Create JWT tokens
  static createTokens(userId: string, role: UserRole): { accessToken: string; refreshToken: string; sessionId: string } {
    const sessionId = this.generateSessionId();
    
    const accessToken = jwt.sign(
      { userId, role, sessionId, type: 'access' },
      SECURITY_CONFIG.JWT_SECRET,
      { expiresIn: this.TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId, sessionId, type: 'refresh' },
      SECURITY_CONFIG.JWT_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );

    // Track active session
    if (!this.activeSessions.has(userId)) {
      this.activeSessions.set(userId, new Set());
    }
    this.activeSessions.get(userId)!.add(sessionId);

    return { accessToken, refreshToken, sessionId };
  }

  // Verify JWT token
  static verifyToken(token: string): JWTPayload | null {
    try {
      if (this.tokenBlacklist.has(token)) {
        return null;
      }

      const payload = jwt.verify(token, SECURITY_CONFIG.JWT_SECRET) as JWTPayload;
      
      // Check if session is still active
      const userSessions = this.activeSessions.get(payload.userId);
      if (!userSessions || !userSessions.has(payload.sessionId)) {
        return null;
      }

      return payload;
    } catch (error) {
      return null;
    }
  }

  // Refresh access token
  static refreshAccessToken(refreshToken: string): { accessToken: string } | null {
    try {
      const payload = jwt.verify(refreshToken, SECURITY_CONFIG.JWT_SECRET) as any;
      
      if (payload.type !== 'refresh') {
        return null;
      }

      // Check if session is still active
      const userSessions = this.activeSessions.get(payload.userId);
      if (!userSessions || !userSessions.has(payload.sessionId)) {
        return null;
      }

      // Create new access token
      const accessToken = jwt.sign(
        { userId: payload.userId, role: payload.role, sessionId: payload.sessionId, type: 'access' },
        SECURITY_CONFIG.JWT_SECRET,
        { expiresIn: this.TOKEN_EXPIRY }
      );

      return { accessToken };
    } catch (error) {
      return null;
    }
  }

  // Logout and invalidate tokens
  static logout(userId: string, sessionId?: string): void {
    if (sessionId) {
      // Logout specific session
      const userSessions = this.activeSessions.get(userId);
      if (userSessions) {
        userSessions.delete(sessionId);
        if (userSessions.size === 0) {
          this.activeSessions.delete(userId);
        }
      }
    } else {
      // Logout all sessions for user
      this.activeSessions.delete(userId);
    }
  }

  // Blacklist token
  static blacklistToken(token: string): void {
    this.tokenBlacklist.add(token);
    
    // Clean up old blacklisted tokens periodically
    if (this.tokenBlacklist.size > 10000) {
      const tokensToRemove = Array.from(this.tokenBlacklist).slice(0, 5000);
      tokensToRemove.forEach(t => this.tokenBlacklist.delete(t));
    }
  }

  // Get active sessions for user
  static getActiveSessions(userId: string): string[] {
    return Array.from(this.activeSessions.get(userId) || []);
  }

  // Clean up expired sessions
  static cleanupExpiredSessions(): void {
    for (const [userId, sessionIds] of this.activeSessions.entries()) {
      if (sessionIds.size === 0) {
        this.activeSessions.delete(userId);
      }
    }
  }
}

// Multi-factor Authentication Support
export class MFAManager {
  private static pendingMFA = new Map<string, { code: string; expires: number; attempts: number }>();

  static generateMFACode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  static createMFAChallenge(userId: string): string {
    const code = this.generateMFACode();
    const expires = Date.now() + (5 * 60 * 1000); // 5 minutes
    
    this.pendingMFA.set(userId, { code, expires, attempts: 0 });
    return code;
  }

  static verifyMFACode(userId: string, inputCode: string): boolean {
    const challenge = this.pendingMFA.get(userId);
    
    if (!challenge || challenge.expires < Date.now()) {
      this.pendingMFA.delete(userId);
      return false;
    }

    challenge.attempts++;

    if (challenge.attempts > 3) {
      this.pendingMFA.delete(userId);
      return false;
    }

    if (challenge.code === inputCode) {
      this.pendingMFA.delete(userId);
      return true;
    }

    return false;
  }
}

// Enhanced Authentication Middleware
export const enhancedAuth = (requiredRole?: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

      if (!token) {
        logSecurityEvent('auth_attempt', req, { reason: 'missing_token' });
        return res.status(401).json({ error: 'Access token required' });
      }

      const payload = AuthenticationSecurity.verifyToken(token);
      if (!payload) {
        logSecurityEvent('auth_attempt', req, { reason: 'invalid_token' });
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Check role permissions
      if (requiredRole && payload.role !== requiredRole && payload.role !== UserRole.SUPER_ADMIN) {
        logSecurityEvent('auth_attempt', req, { 
          reason: 'insufficient_permissions',
          required: requiredRole,
          actual: payload.role 
        }, payload.userId);
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Attach user info to request
      (req as any).user = {
        userId: payload.userId,
        role: payload.role,
        sessionId: payload.sessionId
      };

      next();
    } catch (error) {
      logSecurityEvent('auth_attempt', req, { reason: 'auth_error', error: error.message });
      return res.status(500).json({ error: 'Authentication error' });
    }
  };
};

// Account Security Features
export class AccountSecurity {
  private static loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  static recordLoginAttempt(identifier: string, success: boolean): { allowed: boolean; attemptsLeft: number; lockedUntil?: number } {
    const now = Date.now();
    const attempts = this.loginAttempts.get(identifier) || { count: 0, lastAttempt: 0 };

    // Reset attempts if lockout period has passed
    if (attempts.lockedUntil && now > attempts.lockedUntil) {
      attempts.count = 0;
      attempts.lockedUntil = undefined;
    }

    if (success) {
      // Reset on successful login
      this.loginAttempts.delete(identifier);
      return { allowed: true, attemptsLeft: this.MAX_LOGIN_ATTEMPTS };
    }

    // Check if currently locked
    if (attempts.lockedUntil && now < attempts.lockedUntil) {
      return { allowed: false, attemptsLeft: 0, lockedUntil: attempts.lockedUntil };
    }

    // Increment failed attempts
    attempts.count++;
    attempts.lastAttempt = now;

    if (attempts.count >= this.MAX_LOGIN_ATTEMPTS) {
      attempts.lockedUntil = now + this.LOCKOUT_DURATION;
      this.loginAttempts.set(identifier, attempts);
      return { allowed: false, attemptsLeft: 0, lockedUntil: attempts.lockedUntil };
    }

    this.loginAttempts.set(identifier, attempts);
    return { allowed: true, attemptsLeft: this.MAX_LOGIN_ATTEMPTS - attempts.count };
  }

  static isAccountLocked(identifier: string): boolean {
    const attempts = this.loginAttempts.get(identifier);
    if (!attempts || !attempts.lockedUntil) return false;
    
    const now = Date.now();
    if (now > attempts.lockedUntil) {
      // Lockout expired, clean up
      this.loginAttempts.delete(identifier);
      return false;
    }
    
    return true;
  }

  static unlockAccount(identifier: string): void {
    this.loginAttempts.delete(identifier);
  }
}