# Security Infrastructure - The Divine Vanity

## Overview

The Divine Vanity platform includes comprehensive enterprise-grade security infrastructure designed to protect user data, prevent unauthorized access, and ensure secure communication between clients and the platform. This document outlines the security features implemented across the platform.

## Security Architecture

### Core Security Modules

#### 1. Authentication & Authorization (`server/security.ts`)
- **Multi-layered Authentication**: Supports both Replit Auth and custom username/password authentication
- **Role-Based Access Control (RBAC)**: Five-tier role system (guest, member, premium, admin, super_admin)
- **Password Security**: BCrypt hashing with 12 rounds for maximum protection
- **JWT Token Management**: Secure token generation and validation for admin sessions
- **Account Lockout**: Protection against brute force attacks with configurable lockout periods

#### 2. Request Security Middleware (`server/middleware.ts`)
- **Rate Limiting**: Configurable rate limiting for API endpoints and login attempts
- **Input Sanitization**: Automatic sanitization of user inputs to prevent XSS attacks
- **Request Validation**: Comprehensive input validation with Zod schemas
- **Security Headers**: HTTPS enforcement, CSP, HSTS, and anti-clickjacking headers
- **Request Logging**: Detailed security audit logging for all API requests

#### 3. Data Protection
- **Message Encryption**: AES-256-GCM encryption for sensitive message content
- **Database Security**: Parameterized queries and SQL injection prevention
- **Session Management**: Secure session handling with expiration and cleanup
- **CSRF Protection**: Token-based CSRF protection for state-changing operations

## Security Features by Component

### User Management
- **Secure Registration**: Email verification and strong password requirements
- **Account Lockout**: Automatic lockout after 5 failed login attempts
- **Role Elevation**: Secure admin privilege escalation with audit logging
- **Session Security**: Automatic session expiration and cleanup

### API Security
- **Rate Limiting**: 100 requests per 15 minutes for general API, 5 login attempts per 15 minutes
- **Input Validation**: All inputs validated against strict schemas
- **Output Sanitization**: HTML content sanitized to prevent XSS
- **Error Handling**: Secure error responses that don't leak sensitive information

### Admin Security
- **Dual Authentication**: Admin key (`divine-admin-2025`) and JWT token support
- **Audit Logging**: Complete logging of all admin actions and security events
- **Privilege Separation**: Granular permissions system for different admin levels
- **Access Control**: IP-based access restrictions and user agent validation

### Data Encryption
- **At-Rest Encryption**: Sensitive data encrypted in database using AES-256-GCM
- **In-Transit Encryption**: HTTPS enforcement with HSTS headers
- **Key Management**: Secure key generation and rotation capabilities
- **Message Privacy**: Client-coach messages encrypted end-to-end

## Security Configuration

### Environment Variables
```bash
# Required for production deployment
ENCRYPTION_KEY=<64-character-hex-key>
JWT_SECRET=<64-character-hex-secret>
SESSION_SECRET=<32-character-hex-secret>
DATABASE_URL=<secure-postgresql-connection>
```

### Rate Limiting Configuration
```javascript
// API Rate Limiting
windowMs: 15 * 60 * 1000    // 15 minutes
max: 100                     // requests per window

// Login Rate Limiting  
windowMs: 15 * 60 * 1000    // 15 minutes
max: 5                       // attempts per window
```

### Security Headers
The platform automatically applies these security headers:
- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME sniffing)
- **X-XSS-Protection**: 1; mode=block (XSS protection)
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Content-Security-Policy**: Strict CSP with allowed domains
- **Strict-Transport-Security**: HSTS for HTTPS enforcement

## User Roles & Permissions

### Role Hierarchy
1. **Guest**: Read-only access to public content
2. **Member**: Basic platform access with limited features
3. **Premium**: Full platform access including AI features ($49/month)
4. **Admin**: Administrative access with user management
5. **Super Admin**: Full system access with elevated privileges

### Permission Matrix
| Permission | Guest | Member | Premium | Admin | Super Admin |
|------------|-------|--------|---------|-------|-------------|
| Read Public | ✓ | ✓ | ✓ | ✓ | ✓ |
| Basic Features | - | ✓ | ✓ | ✓ | ✓ |
| Premium Features | - | - | ✓ | ✓ | ✓ |
| Admin Panel | - | - | - | ✓ | ✓ |
| System Config | - | - | - | - | ✓ |

## Security Monitoring

### Audit Logging
All security-relevant events are logged with:
- Timestamp and user identification
- Action performed and resource accessed
- IP address and user agent information
- Success/failure status and error details

### Security Events
The system monitors and logs:
- Failed login attempts and account lockouts
- Admin access and privilege escalation
- Suspicious API usage patterns
- Input validation failures
- Authentication bypass attempts

### Alert Thresholds
- **High Priority**: Authentication bypass attempts, admin access failures
- **Medium Priority**: Unusual API usage, input validation failures
- **Low Priority**: Normal failed logins, rate limit exceeded

## Best Practices

### For Developers
1. Always use parameterized queries for database operations
2. Validate all inputs using Zod schemas
3. Apply principle of least privilege for API endpoints
4. Use secure session management practices
5. Implement proper error handling without information leakage

### For Administrators
1. Regularly rotate encryption keys and secrets
2. Monitor security audit logs for suspicious activity
3. Keep user roles and permissions up to date
4. Review and update rate limiting thresholds as needed
5. Ensure HTTPS is properly configured in production

### For Users
1. Use strong, unique passwords for accounts
2. Enable two-factor authentication when available
3. Log out of sessions when finished
4. Report suspicious activity to administrators
5. Keep account information up to date

## Incident Response

### Security Incident Workflow
1. **Detection**: Automated monitoring alerts or manual reporting
2. **Assessment**: Evaluate severity and potential impact
3. **Containment**: Implement immediate protective measures
4. **Investigation**: Analyze logs and determine root cause
5. **Recovery**: Restore normal operations with enhanced protections
6. **Review**: Update security measures based on lessons learned

### Emergency Contacts
- **Security Team**: vanessa.rich@aol.com
- **System Administrator**: Development team via Replit
- **Escalation**: Contact Replit support for infrastructure issues

## Compliance & Standards

### Security Standards
- **Data Protection**: GDPR-compliant data handling practices
- **Payment Security**: PCI DSS compliance for Stripe integration
- **Authentication**: OWASP authentication guidelines
- **Session Management**: OWASP session management best practices

### Regular Security Reviews
- **Monthly**: Security audit log review
- **Quarterly**: Permission and access review
- **Annually**: Full security infrastructure assessment
- **As Needed**: Post-incident security improvements

## Security Updates

### Version History
- **v1.0.0**: Initial security infrastructure implementation
- **v1.1.0**: Enhanced rate limiting and audit logging
- **v1.2.0**: Added message encryption and CSRF protection
- **v1.3.0**: Implemented role-based access control system

### Planned Enhancements
- Two-factor authentication implementation
- Advanced intrusion detection system
- Automated security vulnerability scanning
- Enhanced encryption key management

## Contact Information

For security-related questions, concerns, or incident reporting:

**Security Team**: vanessa.rich@aol.com  
**Project Lead**: Vanessa Rich  
**Platform**: The Divine Vanity  

*This security documentation is regularly updated to reflect the current security posture of The Divine Vanity platform.*