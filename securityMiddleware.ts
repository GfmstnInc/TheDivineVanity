import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import { SECURITY_CONFIG } from './security';

// CSRF Protection
export const csrfTokens = new Map<string, { token: string; expires: number }>();

export const generateCSRFToken = (sessionId: string): string => {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  csrfTokens.set(sessionId, { token, expires });
  return token;
};

export const validateCSRFToken = (sessionId: string, token: string): boolean => {
  const storedToken = csrfTokens.get(sessionId);
  if (!storedToken || storedToken.expires < Date.now()) {
    csrfTokens.delete(sessionId);
    return false;
  }
  return storedToken.token === token;
};

// Security Headers Middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://trusted-cdns.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.anthropic.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Enhanced Rate Limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: { error: 'API rate limit exceeded, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input Validation Middleware
export const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username must be 3-30 characters, alphanumeric, underscore, or dash only'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
];

export const validateLogin = [
  body('username')
    .isLength({ min: 1 })
    .trim()
    .escape()
    .withMessage('Username required'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password required'),
];

export const validateJournalEntry = [
  body('content')
    .isLength({ min: 1, max: 10000 })
    .trim()
    .withMessage('Journal content must be 1-10000 characters'),
  body('prompt')
    .isLength({ min: 1, max: 500 })
    .trim()
    .escape()
    .withMessage('Prompt must be 1-500 characters'),
];

export const validateChatMessage = [
  body('message')
    .isLength({ min: 1, max: 2000 })
    .trim()
    .withMessage('Message must be 1-2000 characters'),
];

// Input Sanitization
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// XSS Protection
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.replace(xssPattern, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitizeObject(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  next();
};

// CSRF Protection Middleware
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const sessionId = req.session?.id || req.sessionID;
  const csrfToken = req.headers['x-csrf-token'] as string;

  if (!csrfToken || !validateCSRFToken(sessionId, csrfToken)) {
    return res.status(403).json({ error: 'CSRF token validation failed' });
  }

  next();
};

// Session Security
export const sessionSecurity = (req: Request, res: Response, next: NextFunction) => {
  if (req.session) {
    // Regenerate session ID on login
    if (req.path === '/api/login' && req.method === 'POST') {
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration error:', err);
        }
        next();
      });
      return;
    }
    
    // Session timeout (30 minutes)
    const sessionTimeout = 30 * 60 * 1000;
    if (req.session.lastActivity && Date.now() - req.session.lastActivity > sessionTimeout) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
        return res.status(401).json({ error: 'Session expired' });
      });
      return;
    }
    
    req.session.lastActivity = Date.now();
  }
  
  next();
};

// Security Audit Logging
interface SecurityEvent {
  timestamp: Date;
  type: 'auth_attempt' | 'csrf_violation' | 'rate_limit' | 'validation_error' | 'session_expired';
  ip: string;
  userAgent: string;
  userId?: string;
  details?: any;
}

export const securityAuditLog: SecurityEvent[] = [];
const MAX_LOG_ENTRIES = 10000;

export const logSecurityEvent = (
  type: SecurityEvent['type'],
  req: Request,
  details?: any,
  userId?: string
) => {
  const event: SecurityEvent = {
    timestamp: new Date(),
    type,
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent') || 'unknown',
    userId,
    details
  };

  securityAuditLog.push(event);
  
  // Rotate logs to prevent memory issues
  if (securityAuditLog.length > MAX_LOG_ENTRIES) {
    securityAuditLog.splice(0, securityAuditLog.length - MAX_LOG_ENTRIES);
  }

  // Log critical events
  if (['csrf_violation', 'rate_limit'].includes(type)) {
    console.warn(`[SECURITY] ${type}:`, {
      ip: event.ip,
      userAgent: event.userAgent,
      details: event.details
    });
  }
};

// API Key Validation for webhooks
export const validateWebhookSignature = (secret: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['x-webhook-signature'] as string;
    const payload = JSON.stringify(req.body);
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (!signature || signature !== expectedSignature) {
      logSecurityEvent('validation_error', req, { reason: 'invalid_webhook_signature' });
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    next();
  };
};

// Request Size Limits
export const requestSizeLimits = {
  json: { limit: '1mb' },
  urlencoded: { limit: '1mb', extended: true },
  raw: { limit: '5mb' }
};