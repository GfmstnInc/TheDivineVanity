// Maximum Security Framework for Intake Assessment System
// Enterprise-grade security for sensitive spiritual and psychological data

import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { SecurityPolicyEngine, DataLossPrevention, SecurityMiddlewareStack } from './securityFramework';

// Encryption keys for sensitive assessment data
const ASSESSMENT_ENCRYPTION_KEY = process.env.ASSESSMENT_ENCRYPTION_KEY || crypto.randomBytes(32);
const ASSESSMENT_IV_LENGTH = 16;

// Maximum security rate limiter for assessment submissions
export const assessmentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Maximum 3 assessment submissions per 15 minutes per IP
  message: {
    error: 'Too many assessment submissions. Please wait before submitting another assessment.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log('Rate limit exceeded:', {
      ip: req.ip,
      endpoint: '/api/intake-assessment',
      message: 'Rate limit exceeded for assessment submission'
    });
    res.status(429).json({
      error: 'Too many assessment submissions. Please wait before submitting another assessment.',
      retryAfter: '15 minutes'
    });
  }
});

// Comprehensive input validation schema for assessment responses
export const assessmentValidationSchema = z.object({
  assessmentType: z.enum(['decode_you', 'follow_up', 'crisis_check', 'monthly_review']),
  responses: z.record(z.string(), z.string().max(2000, 'Response too long')).refine(
    (responses) => Object.keys(responses).length >= 5,
    { message: 'Minimum 5 responses required for valid assessment' }
  ),
  formType: z.enum(['initial_intake', 'follow_up', 'crisis_assessment', 'routine_check']).optional(),
  notes: z.string().max(5000, 'Notes too long').optional(),
  sessionMetadata: z.object({
    userAgent: z.string().optional(),
    deviceType: z.string().optional(),
    completionTime: z.number().min(60, 'Suspiciously fast completion').max(7200, 'Session too long').optional(),
    interactionPattern: z.array(z.string()).optional()
  }).optional()
});

// Sanitization function for assessment responses
export function sanitizeAssessmentData(data: any): any {
  const sanitized = { ...data };
  
  // Remove potentially harmful scripts and HTML
  const sanitizeString = (str: string): string => {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  // Sanitize all string values recursively
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj && typeof obj === 'object') {
      const sanitizedObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitizedObj[sanitizeString(key)] = sanitizeObject(value);
      }
      return sanitizedObj;
    }
    return obj;
  };

  return sanitizeObject(sanitized);
}

// Advanced encryption for sensitive assessment responses
export function encryptAssessmentData(data: any): string {
  try {
    const iv = crypto.randomBytes(ASSESSMENT_IV_LENGTH);
    const cipher = crypto.createCipher('aes-256-gcm', ASSESSMENT_ENCRYPTION_KEY);
    cipher.setAAD(Buffer.from('assessment-data'));
    
    const dataString = JSON.stringify(data);
    let encrypted = cipher.update(dataString, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return JSON.stringify({
      iv: iv.toString('hex'),
      encryptedData: encrypted,
      authTag: authTag.toString('hex')
    });
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt assessment data');
  }
}

// Decryption for retrieving assessment responses
export function decryptAssessmentData(encryptedString: string): any {
  try {
    const { iv, encryptedData, authTag } = JSON.parse(encryptedString);
    
    const decipher = crypto.createDecipher('aes-256-gcm', ASSESSMENT_ENCRYPTION_KEY);
    decipher.setAAD(Buffer.from('assessment-data'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt assessment data');
  }
}

// Risk assessment for identifying concerning responses
export function assessResponseRisk(responses: Record<string, string>): {
  riskLevel: 'low' | 'medium' | 'high' | 'crisis';
  riskFactors: string[];
  recommendedActions: string[];
  requiresHumanReview: boolean;
} {
  const riskFactors: string[] = [];
  const recommendedActions: string[] = [];
  
  // Crisis keywords that require immediate attention
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead',
    'hurt myself', 'self harm', 'cutting', 'overdose', 'want to die'
  ];
  
  // High-risk indicators
  const highRiskKeywords = [
    'hopeless', 'trapped', 'overwhelming', 'can\'t cope', 'breaking down',
    'losing control', 'panic attacks', 'severe depression', 'addiction'
  ];
  
  // Medium-risk indicators
  const mediumRiskKeywords = [
    'anxious', 'stressed', 'lonely', 'isolated', 'struggling', 'worried',
    'overwhelmed', 'burnt out', 'emotional', 'unstable'
  ];

  let crisisDetected = false;
  let highRiskDetected = false;
  let mediumRiskDetected = false;

  // Analyze all responses for risk indicators
  const allResponses = Object.values(responses).join(' ').toLowerCase();
  
  // Check for crisis indicators
  for (const keyword of crisisKeywords) {
    if (allResponses.includes(keyword)) {
      crisisDetected = true;
      riskFactors.push(`Crisis language detected: "${keyword}"`);
    }
  }
  
  // Check for high-risk indicators
  for (const keyword of highRiskKeywords) {
    if (allResponses.includes(keyword)) {
      highRiskDetected = true;
      riskFactors.push(`High-risk indicator: "${keyword}"`);
    }
  }
  
  // Check for medium-risk indicators
  for (const keyword of mediumRiskKeywords) {
    if (allResponses.includes(keyword)) {
      mediumRiskDetected = true;
      riskFactors.push(`Medium-risk indicator: "${keyword}"`);
    }
  }

  // Determine risk level and actions
  let riskLevel: 'low' | 'medium' | 'high' | 'crisis' = 'low';
  let requiresHumanReview = false;

  if (crisisDetected) {
    riskLevel = 'crisis';
    requiresHumanReview = true;
    recommendedActions.push(
      'IMMEDIATE HUMAN REVIEW REQUIRED',
      'Display crisis resources immediately',
      'Consider emergency contact protocols',
      'Gentle, supportive language only'
    );
  } else if (highRiskDetected) {
    riskLevel = 'high';
    requiresHumanReview = true;
    recommendedActions.push(
      'Human review within 24 hours',
      'Provide mental health resources',
      'Gentle approach to offerings',
      'Follow up within 1 week'
    );
  } else if (mediumRiskDetected) {
    riskLevel = 'medium';
    recommendedActions.push(
      'Monitor for escalation',
      'Provide supportive resources',
      'Consider lower-pressure offerings',
      'Check in within 2 weeks'
    );
  } else {
    recommendedActions.push(
      'Standard Vanessa DI guidance appropriate',
      'Normal offering timing acceptable',
      'Continue regular support'
    );
  }

  return {
    riskLevel,
    riskFactors,
    recommendedActions,
    requiresHumanReview
  };
}

// Comprehensive audit logging for assessment activities
export function logAssessmentActivity(
  userId: string,
  action: string,
  details: any,
  riskLevel?: string
): void {
  console.log('Assessment activity:', {
    userId,
    action,
    resource: 'intake_assessment',
    details: {
      ...details,
      riskLevel,
      timestamp: new Date().toISOString()
    }
  });
}

// Input validation middleware specifically for assessments
export function validateAssessmentInput(req: any, res: any, next: any): void {
  try {
    // Validate request structure
    const validationResult = assessmentValidationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      logAssessmentActivity(
        req.user?.id || 'anonymous',
        'VALIDATION_FAILED',
        { errors: validationResult.error.issues }
      );
      
      return res.status(400).json({
        error: 'Invalid assessment data',
        details: validationResult.error.issues
      });
    }

    // Sanitize the validated data
    req.body = sanitizeAssessmentData(validationResult.data);
    
    // Check for suspicious patterns
    const responses = req.body.responses;
    const responseValues = Object.values(responses).join(' ');
    
    // Detect potential spam or bot submissions
    if (responseValues.length < 50) {
      logAssessmentActivity(
        req.user?.id || 'anonymous',
        'SUSPICIOUS_SUBMISSION',
        { reason: 'Responses too short', length: responseValues.length }
      );
      
      return res.status(400).json({
        error: 'Assessment responses appear incomplete'
      });
    }
    
    // Detect repeated patterns that might indicate automated submission
    const words = responseValues.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const repetitionRatio = words.length / uniqueWords.size;
    
    if (repetitionRatio > 3) {
      logAssessmentActivity(
        req.user?.id || 'anonymous',
        'SUSPICIOUS_SUBMISSION',
        { reason: 'High word repetition', ratio: repetitionRatio }
      );
      
      return res.status(400).json({
        error: 'Assessment responses appear to contain excessive repetition'
      });
    }

    next();
  } catch (error) {
    console.error('Assessment validation error:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
}

// Session integrity verification
export function verifySessionIntegrity(sessionData: any): boolean {
  if (!sessionData) return false;
  
  const { completionTime, interactionPattern } = sessionData;
  
  // Verify reasonable completion time (1 minute to 2 hours)
  if (completionTime && (completionTime < 60 || completionTime > 7200)) {
    return false;
  }
  
  // Verify interaction patterns suggest human behavior
  if (interactionPattern && interactionPattern.length < 3) {
    return false;
  }
  
  return true;
}

// Generate secure assessment session token
export function generateSecureSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export default {
  assessmentRateLimit,
  assessmentValidationSchema,
  sanitizeAssessmentData,
  encryptAssessmentData,
  decryptAssessmentData,
  assessResponseRisk,
  logAssessmentActivity,
  validateAssessmentInput,
  verifySessionIntegrity,
  generateSecureSessionToken
};