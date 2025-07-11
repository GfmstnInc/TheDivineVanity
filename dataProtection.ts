import crypto from 'crypto';
import { MessageEncryption } from './security';

// Advanced Data Protection and Privacy
export class DataProtection {
  // Data Classification
  static readonly DATA_CLASSIFICATIONS = {
    PUBLIC: 'public',
    INTERNAL: 'internal',
    CONFIDENTIAL: 'confidential',
    RESTRICTED: 'restricted'
  } as const;

  // PII Detection and Masking
  static readonly PII_PATTERNS = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
    ssn: /\b(?!000|666|9\d{2})\d{3}[-.\s]?(?!00)\d{2}[-.\s]?(?!0000)\d{4}\b/g,
    creditCard: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    ipAddress: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g
  };

  // Detect PII in text
  static detectPII(text: string): { type: string; matches: string[] }[] {
    const detected: { type: string; matches: string[] }[] = [];

    for (const [type, pattern] of Object.entries(this.PII_PATTERNS)) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        detected.push({ type, matches });
      }
    }

    return detected;
  }

  // Mask PII in text
  static maskPII(text: string, maskChar: string = '*'): string {
    let maskedText = text;

    // Email masking
    maskedText = maskedText.replace(this.PII_PATTERNS.email, (match) => {
      const [user, domain] = match.split('@');
      const maskedUser = user.charAt(0) + maskChar.repeat(user.length - 2) + user.charAt(user.length - 1);
      return `${maskedUser}@${domain}`;
    });

    // Phone masking
    maskedText = maskedText.replace(this.PII_PATTERNS.phone, (match) => {
      return maskChar.repeat(match.length - 4) + match.slice(-4);
    });

    // Credit card masking
    maskedText = maskedText.replace(this.PII_PATTERNS.creditCard, (match) => {
      return maskChar.repeat(match.length - 4) + match.slice(-4);
    });

    // SSN masking
    maskedText = maskedText.replace(this.PII_PATTERNS.ssn, () => {
      return `${maskChar.repeat(3)}-${maskChar.repeat(2)}-****`;
    });

    // IP address masking
    maskedText = maskedText.replace(this.PII_PATTERNS.ipAddress, (match) => {
      const parts = match.split('.');
      return `${parts[0]}.${parts[1]}.${maskChar.repeat(3)}.${maskChar.repeat(3)}`;
    });

    return maskedText;
  }

  // Data Anonymization
  static anonymizeUserData(userData: any): any {
    const anonymized = { ...userData };

    // Remove direct identifiers
    delete anonymized.email;
    delete anonymized.phone;
    delete anonymized.firstName;
    delete anonymized.lastName;
    delete anonymized.profileImageUrl;

    // Hash persistent identifiers
    if (anonymized.id) {
      anonymized.hashedId = crypto.createHash('sha256').update(anonymized.id).digest('hex');
      delete anonymized.id;
    }

    // Generalize data
    if (anonymized.birthDate) {
      const birthYear = new Date(anonymized.birthDate).getFullYear();
      anonymized.ageRange = this.getAgeRange(new Date().getFullYear() - birthYear);
      delete anonymized.birthDate;
    }

    return anonymized;
  }

  private static getAgeRange(age: number): string {
    if (age < 18) return '0-17';
    if (age < 25) return '18-24';
    if (age < 35) return '25-34';
    if (age < 45) return '35-44';
    if (age < 55) return '45-54';
    if (age < 65) return '55-64';
    return '65+';
  }

  // Data Retention Management
  static readonly RETENTION_POLICIES = {
    userSessions: 24 * 60 * 60 * 1000, // 24 hours
    auditLogs: 90 * 24 * 60 * 60 * 1000, // 90 days
    userContent: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
    analyticsData: 365 * 24 * 60 * 60 * 1000, // 1 year
    backups: 7 * 365 * 24 * 60 * 60 * 1000 // 7 years
  };

  // GDPR Compliance Tools
  static processDataRequest(type: 'export' | 'delete' | 'rectify', userId: string, data?: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        switch (type) {
          case 'export':
            // Export all user data
            const exportData = await this.exportUserData(userId);
            resolve(exportData);
            break;

          case 'delete':
            // Delete all user data (right to be forgotten)
            await this.deleteUserData(userId);
            resolve({ success: true, message: 'User data deleted successfully' });
            break;

          case 'rectify':
            // Update/correct user data
            await this.rectifyUserData(userId, data);
            resolve({ success: true, message: 'User data updated successfully' });
            break;

          default:
            reject(new Error('Invalid request type'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private static async exportUserData(userId: string): Promise<any> {
    // This would integrate with your storage system
    // Return all user data in a structured format
    return {
      personalData: {
        // User profile information
      },
      activityData: {
        // User interactions, sessions, etc.
      },
      contentData: {
        // User-generated content
      },
      preferences: {
        // User settings and preferences
      },
      exportDate: new Date().toISOString(),
      dataProtectionNotice: 'This export contains all personal data we hold about you.'
    };
  }

  private static async deleteUserData(userId: string): Promise<void> {
    // This would integrate with your storage system
    // Delete or anonymize all user data
    console.log(`Deleting all data for user ${userId}`);
  }

  private static async rectifyUserData(userId: string, data: any): Promise<void> {
    // This would integrate with your storage system
    // Update user data with corrections
    console.log(`Updating data for user ${userId}`, data);
  }
}

// Secure Data Handling Utilities
export class SecureDataHandler {
  // Secure field encryption for sensitive data
  static encryptSensitiveField(value: string): string {
    return MessageEncryption.encrypt(value).encrypted;
  }

  static decryptSensitiveField(encryptedValue: string, iv: string, tag: string): string {
    return MessageEncryption.decrypt({ encrypted: encryptedValue, iv, tag });
  }

  // Database query sanitization
  static sanitizeQuery(query: string): string {
    // Remove potential SQL injection patterns
    const dangerousPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
      /(--|\*\/|\/\*)/g,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
      /(\b(UNION|JOIN)\b)/gi
    ];

    let sanitized = query;
    dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    return sanitized.trim();
  }

  // Safe JSON parsing
  static safeJSONParse(jsonString: string, defaultValue: any = null): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('JSON parse error:', error.message);
      return defaultValue;
    }
  }

  // Memory-safe string operations
  static secureStringCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  // Secure random string generation
  static generateSecureRandomString(length: number = 32): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      result += charset[randomIndex];
    }

    return result;
  }
}

// Data Backup and Recovery
export class DataBackupManager {
  private static readonly BACKUP_ENCRYPTION_KEY = process.env.BACKUP_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

  static async createSecureBackup(data: any): Promise<string> {
    const compressed = JSON.stringify(data);
    const encrypted = MessageEncryption.encrypt(compressed);
    
    return JSON.stringify({
      version: '1.0',
      timestamp: Date.now(),
      data: encrypted,
      checksum: crypto.createHash('sha256').update(compressed).digest('hex')
    });
  }

  static async restoreSecureBackup(backupData: string): Promise<any> {
    try {
      const backup = JSON.parse(backupData);
      const decrypted = MessageEncryption.decrypt(backup.data);
      const checksum = crypto.createHash('sha256').update(decrypted).digest('hex');
      
      if (checksum !== backup.checksum) {
        throw new Error('Backup integrity check failed');
      }

      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error(`Backup restoration failed: ${error.message}`);
    }
  }
}