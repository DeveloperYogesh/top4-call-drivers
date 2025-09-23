// Security utilities for enhanced protection

import crypto from 'crypto';

// Input sanitization
export const sanitization = {
  // Sanitize HTML input to prevent XSS
  sanitizeHtml: (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // Sanitize SQL input to prevent SQL injection
  sanitizeSql: (input: string): string => {
    return input.replace(/['";\\]/g, '');
  },

  // Validate and sanitize phone numbers
  sanitizePhoneNumber: (phone: string): string => {
    return phone.replace(/[^\d+]/g, '');
  },

  // Validate and sanitize email addresses
  sanitizeEmail: (email: string): string => {
    return email.toLowerCase().trim();
  },

  // Remove potentially dangerous characters
  sanitizeInput: (input: string): string => {
    return input.replace(/[<>'"&]/g, '');
  },
};

// CSRF protection
export const csrfProtection = {
  // Generate CSRF token
  generateToken: (): string => {
    return crypto.randomBytes(32).toString('hex');
  },

  // Verify CSRF token
  verifyToken: (token: string, sessionToken: string): boolean => {
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(sessionToken, 'hex')
    );
  },

  // Create CSRF middleware for API routes
  createMiddleware: (getSessionToken: (req: any) => string | null) => {
    return (req: any, res: any, next: any) => {
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const token = req.headers['x-csrf-token'] || req.body._csrf;
        const sessionToken = getSessionToken(req);

        if (!token || !sessionToken || !csrfProtection.verifyToken(token, sessionToken)) {
          return res.status(403).json({
            status: 'error',
            message: 'Invalid CSRF token',
          });
        }
      }
      next();
    };
  },
};

// Request validation
export const requestValidation = {
  // Validate request body size
  validateBodySize: (body: any, maxSize: number = 1024 * 1024): boolean => {
    const bodySize = JSON.stringify(body).length;
    return bodySize <= maxSize;
  },

  // Validate request headers
  validateHeaders: (headers: Headers): boolean => {
    const contentType = headers.get('content-type');
    const userAgent = headers.get('user-agent');

    // Check for suspicious patterns
    if (!userAgent || userAgent.length < 10) {
      return false;
    }

    if (contentType && !contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
      return false;
    }

    return true;
  },

  // Validate file uploads
  validateFileUpload: (file: File, allowedTypes: string[], maxSize: number): boolean => {
    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    if (file.size > maxSize) {
      return false;
    }

    return true;
  },
};

// Session security
export const sessionSecurity = {
  // Generate secure session ID
  generateSessionId: (): string => {
    return crypto.randomBytes(32).toString('hex');
  },

  // Hash session data
  hashSessionData: (data: string, secret: string): string => {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  },

  // Verify session integrity
  verifySessionIntegrity: (data: string, hash: string, secret: string): boolean => {
    const expectedHash = sessionSecurity.hashSessionData(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  },

  // Create secure cookie options
  getSecureCookieOptions: (isProduction: boolean = process.env.NODE_ENV === 'production') => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  }),
};

// API security
export const apiSecurity = {
  // Generate API key
  generateApiKey: (): string => {
    return crypto.randomBytes(32).toString('base64url');
  },

  // Hash API key for storage
  hashApiKey: (apiKey: string): string => {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  },

  // Verify API key
  verifyApiKey: (apiKey: string, hashedKey: string): boolean => {
    const hash = apiSecurity.hashApiKey(apiKey);
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(hashedKey, 'hex')
    );
  },

  // Rate limiting key generation
  generateRateLimitKey: (identifier: string, endpoint: string): string => {
    return `rate_limit:${identifier}:${endpoint}`;
  },
};

// Content Security Policy
export const csp = {
  // Generate nonce for inline scripts
  generateNonce: (): string => {
    return crypto.randomBytes(16).toString('base64');
  },

  // Create CSP header value
  createCspHeader: (nonce?: string): string => {
    const policies = [
      "default-src 'self'",
      `script-src 'self' ${nonce ? `'nonce-${nonce}'` : "'unsafe-inline'"} 'unsafe-eval' https://maps.googleapis.com https://www.google.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.top4calldrivers.com https://maps.googleapis.com",
      "frame-src 'self' https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ];

    return policies.join('; ');
  },
};

// Encryption utilities
export const encryption = {
  // Encrypt sensitive data
  encrypt: (text: string, key: string): string => {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  },

  // Decrypt sensitive data
  decrypt: (encryptedText: string, key: string): string => {
    const algorithm = 'aes-256-gcm';
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipher(algorithm, key);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  },

  // Generate encryption key
  generateKey: (): string => {
    return crypto.randomBytes(32).toString('hex');
  },
};

// Security headers
export const securityHeaders = {
  // Get all security headers
  getAllHeaders: (): Record<string, string> => {
    return {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Content-Security-Policy': csp.createCspHeader(),
    };
  },

  // Apply headers to response
  applyHeaders: (response: Response): Response => {
    const headers = securityHeaders.getAllHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  },
};

// Audit logging
export const auditLogging = {
  // Log security events
  logSecurityEvent: (event: {
    type: 'login' | 'logout' | 'failed_login' | 'api_access' | 'suspicious_activity';
    userId?: string;
    ip?: string;
    userAgent?: string;
    details?: any;
  }) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event,
    };

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service (e.g., CloudWatch, Datadog, etc.)
      console.log('SECURITY_EVENT:', JSON.stringify(logEntry));
    } else {
      console.log('Security Event:', logEntry);
    }
  },

  // Log API access
  logApiAccess: (req: any, res: any) => {
    auditLogging.logSecurityEvent({
      type: 'api_access',
      userId: req.headers['x-user-id'],
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        method: req.method,
        path: req.url,
        statusCode: res.statusCode,
      },
    });
  },
};

// Export all security utilities
export default {
  sanitization,
  csrfProtection,
  requestValidation,
  sessionSecurity,
  apiSecurity,
  csp,
  encryption,
  securityHeaders,
  auditLogging,
};

