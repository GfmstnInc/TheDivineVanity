import { Request, Response, NextFunction } from 'express';
import { UserRole, AccessControl, AdminLogger, InputSecurity, TokenSecurity, SECURITY_CONFIG } from './security';
import { storage } from './storage';

// Rate limiting store - in production, use Redis
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

// Function to reset rate limits (for development/debugging)
export function resetRateLimits() {
  Object.keys(rateLimitStore).forEach(key => {
    delete rateLimitStore[key];
  });
}

// Rate limiting middleware
export function createRateLimit(options: {
  windowMs: number;
  max: number;
  message: string;
  keyGenerator?: (req: Request) => string;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = options.keyGenerator ? options.keyGenerator(req) : req.ip;
    const now = Date.now();
    
    if (!rateLimitStore[key]) {
      rateLimitStore[key] = {
        count: 0,
        resetTime: now + options.windowMs
      };
    }
    
    const record = rateLimitStore[key];
    
    // Reset if window expired
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + options.windowMs;
    }
    
    // Check if limit exceeded
    if (record.count >= options.max) {
      return res.status(429).json({
        error: options.message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      });
    }
    
    record.count++;
    next();
  };
}

// Basic rate limiting for general API endpoints
export const apiRateLimit = createRateLimit(SECURITY_CONFIG.RATE_LIMIT);

// Stricter rate limiting for login attempts
export const loginRateLimit = createRateLimit({
  ...SECURITY_CONFIG.LOGIN_RATE_LIMIT,
  keyGenerator: (req) => `login:${req.ip}:${req.body?.email || 'unknown'}`
});

// Admin authentication middleware
export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const adminKey = req.headers['x-admin-key'] as string;
  const authHeader = req.headers.authorization;
  
  // Check for admin key first (legacy)
  if (adminKey === 'divine-admin-2025') {
    (req as any).user = { 
      id: 'admin', 
      role: UserRole.ADMIN,
      email: 'vanessa.rich@aol.com' 
    };
    
    AdminLogger.logAccess('admin', 'ACCESS', req.path, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      method: req.method
    });
    
    return next();
  }
  
  // Check for JWT token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = TokenSecurity.verifyAdminToken(token);
    
    if (decoded) {
      (req as any).user = decoded;
      
      AdminLogger.logAccess(decoded.userId, 'ACCESS', req.path, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        method: req.method
      });
      
      return next();
    }
  }
  
  AdminLogger.logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS', 'high', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    path: req.path,
    headers: req.headers
  });
  
  return res.status(401).json({ message: 'Admin authentication required' });
}

// Role-based authorization middleware
export function requireRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!AccessControl.hasMinimumRole(user.role, role)) {
      AdminLogger.logSecurityEvent('INSUFFICIENT_PERMISSIONS', 'medium', {
        userId: user.id,
        requiredRole: role,
        userRole: user.role,
        path: req.path
      });
      
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        required: role,
        current: user.role
      });
    }
    
    next();
  };
}

// Input validation middleware
export function validateInput(validations: {
  [field: string]: (value: any) => boolean | string;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: { [field: string]: string } = {};
    
    for (const [field, validator] of Object.entries(validations)) {
      const value = req.body[field];
      const result = validator(value);
      
      if (result !== true) {
        errors[field] = typeof result === 'string' ? result : `Invalid ${field}`;
      }
    }
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
}

// Input sanitization middleware
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        req.body[key] = InputSecurity.sanitizeUserInput(value);
      }
    }
  }
  
  next();
}

// HTTPS enforcement middleware
export function enforceHTTPS(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('X-Forwarded-Proto') !== 'https') {
    return res.redirect(301, `https://${req.get('Host')}${req.url}`);
  }
  next();
}

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.sandbox.paypal.com https://maps.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://api.paypal.com https://api.sandbox.paypal.com https://maps.googleapis.com; " +
    "frame-src https://www.paypal.com https://www.sandbox.paypal.com;"
  );
  
  // Strict Transport Security (HSTS)
  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
}

// Enhanced user authentication middleware
export async function enhancedAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    const authHeader = req.headers.authorization;
    
    if (!sessionId && !authHeader) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check session-based auth first
    if (sessionId) {
      const user = await storage.getUser(sessionId);
      if (user) {
        (req as any).user = {
          ...user,
          role: user.email === 'vanessa.rich@aol.com' ? UserRole.SUPER_ADMIN : 
                user.subscriptionStatus === 'active' ? UserRole.PREMIUM : UserRole.MEMBER
        };
        return next();
      }
    }
    
    // Check JWT token
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = TokenSecurity.verifyAdminToken(token);
      
      if (decoded) {
        const user = await storage.getUser(decoded.userId);
        if (user) {
          (req as any).user = {
            ...user,
            role: decoded.role
          };
          return next();
        }
      }
    }
    
    return res.status(401).json({ message: 'Invalid authentication' });
  } catch (error) {
    AdminLogger.logSecurityEvent('AUTHENTICATION_ERROR', 'high', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    return res.status(500).json({ message: 'Authentication service error' });
  }
}

// Request logging middleware
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.id || 'anonymous'
    };
    
    console.log('[REQUEST]', JSON.stringify(logEntry));
  });
  
  next();
}

// CSRF protection middleware
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET') {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] as string;
  const sessionToken = req.headers['x-session-token'] as string;
  
  if (!token || !sessionToken) {
    return res.status(403).json({ message: 'CSRF token required' });
  }
  
  // Simple CSRF validation - in production, use a more robust method
  if (token !== sessionToken) {
    AdminLogger.logSecurityEvent('CSRF_ATTACK', 'high', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
    
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  
  next();
}

export default {
  apiRateLimit,
  loginRateLimit,
  authenticateAdmin,
  requireRole,
  validateInput,
  sanitizeInput,
  enforceHTTPS,
  securityHeaders,
  enhancedAuth,
  requestLogger,
  csrfProtection
};