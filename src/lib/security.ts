// lib/security.ts
import crypto from 'crypto';

/**
 * Lightweight security utilities.
 * NOTE: This file provides helper functions only. It does NOT automatically
 * install middleware, set HTTP headers, or enforce CSP / rate limiting.
 * Use in development or call the functions explicitly in server routes.
 */

/* ----------------------------- Sanitization ---------------------------- */

export const sanitization = {
  sanitizeHtml: (input: string): string =>
    input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;'),

  sanitizeSql: (input: string): string =>
    input.replace(/['";\\]/g, ''),

  sanitizePhoneNumber: (phone: string): string =>
    phone.replace(/[^\d+]/g, ''),

  sanitizeEmail: (email: string): string =>
    (email || '').toLowerCase().trim(),

  sanitizeInput: (input: string): string =>
    input.replace(/[<>'"&]/g, ''),
};

/* -------------------------------- CSRF -------------------------------- */
/**
 * Passive CSRF helpers: generate and verify tokens.
 * They do not add middleware automatically — use these functions in your handlers.
 */
export const csrfProtection = {
  generateToken: (): string => crypto.randomBytes(32).toString('hex'),

  verifyToken: (token: string | null | undefined, sessionToken: string | null | undefined): boolean => {
    if (!token || !sessionToken) return false;
    try {
      const tBuf = Buffer.from(token, 'hex');
      const sBuf = Buffer.from(sessionToken, 'hex');
      // lengths must match before timingSafeEqual
      if (tBuf.length !== sBuf.length) return false;
      return crypto.timingSafeEqual(tBuf, sBuf);
    } catch {
      return false;
    }
  },
};

/* ---------------------------- Request checks --------------------------- */
export const requestValidation = {
  validateBodySize: (body: any, maxSize = 1024 * 1024): boolean =>
    JSON.stringify(body || '').length <= maxSize,

  /**
   * headers param can be a Headers instance or a Record<string,string>
   * This function only performs light checks — not strict blocking.
   */
  validateHeaders: (headers: Headers | Record<string, string>): boolean => {
    try {
      let contentType = '';
      let userAgent = '';

      if (headers instanceof Headers) {
        contentType = headers.get('content-type') ?? '';
        userAgent = headers.get('user-agent') ?? '';
      } else {
        contentType = (headers['content-type'] ?? headers['Content-Type'] ?? '') as string;
        userAgent = (headers['user-agent'] ?? headers['User-Agent'] ?? '') as string;
      }

      if (!userAgent || userAgent.length < 4) return false;

      // Accept typical content types; be permissive by default
      if (contentType && !(contentType.includes('application/json') || contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded'))) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  // File validation helper (use on server-side with file metadata)
  validateFileUpload: (file: { type: string; size: number }, allowedTypes: string[], maxSize: number): boolean => {
    if (!allowedTypes.includes(file.type)) return false;
    if (file.size > maxSize) return false;
    return true;
  },
};

/* --------------------------- Session utilities ------------------------- */
export const sessionSecurity = {
  generateSessionId: (): string => crypto.randomBytes(32).toString('hex'),

  hashSessionData: (data: string, secret: string): string =>
    crypto.createHmac('sha256', secret).update(data).digest('hex'),

  verifySessionIntegrity: (data: string, hash: string, secret: string): boolean => {
    try {
      const expected = sessionSecurity.hashSessionData(data, secret);
      const a = Buffer.from(hash, 'hex');
      const b = Buffer.from(expected, 'hex');
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  },

  getSecureCookieOptions: (isProduction = process.env.NODE_ENV === 'production') => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  }),
};

/* ----------------------------- API security ---------------------------- */
export const apiSecurity = {
  generateApiKey: (): string => crypto.randomBytes(32).toString('base64url'),

  hashApiKey: (apiKey: string): string =>
    crypto.createHash('sha256').update(apiKey).digest('hex'),

  verifyApiKey: (apiKey: string, hashedKey: string): boolean => {
    try {
      const hash = apiSecurity.hashApiKey(apiKey);
      const a = Buffer.from(hash, 'hex');
      const b = Buffer.from(hashedKey, 'hex');
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  },

  generateRateLimitKey: (identifier: string, endpoint: string): string =>
    `rate_limit:${identifier}:${endpoint}`,
};

/* ------------------------------- CSP helper ---------------------------- */
/**
 * Returns a minimal CSP header string. By default it is permissive (only 'self').
 * If you need to allow additional connect-src hosts (e.g. external APIs), pass them here.
 *
 * NOTE: This function only returns a string — it does NOT set headers automatically.
 */
export const csp = {
  createCspHeader: (opts?: { extraConnectSrc?: string[]; extraScriptSrc?: string[]; includeUpgradeInsecureRequests?: boolean }): string => {
    const extraConnect = (opts?.extraConnectSrc || []).join(' ');
    const extraScript = (opts?.extraScriptSrc || []).join(' ');
    const policies: string[] = [
      "default-src 'self'",
      `script-src 'self' ${extraScript}`.trim(),
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      `connect-src 'self' ${extraConnect}`.trim(),
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ];
    if (opts?.includeUpgradeInsecureRequests) policies.push('upgrade-insecure-requests');
    return policies.filter(Boolean).join('; ');
  },
};

/* ---------------------------- Encryption utils ------------------------ */
export const encryption = {
  encrypt: (text: string, keyHex: string): string => {
    try {
      const algorithm = 'aes-256-gcm';
      const iv = crypto.randomBytes(12);
      const keyBuf = Buffer.from(keyHex, 'hex').subarray(0, 32);
      const cipher = crypto.createCipheriv(algorithm, keyBuf, iv);
      const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
      const authTag = cipher.getAuthTag();
      return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':');
    } catch (err) {
      throw new Error('Encryption failed');
    }
  },

  decrypt: (encryptedText: string, keyHex: string): string => {
    try {
      const algorithm = 'aes-256-gcm';
      const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const encryptedBuf = Buffer.from(encryptedHex, 'hex');
      const keyBuf = Buffer.from(keyHex, 'hex').subarray(0, 32);
      const decipher = crypto.createDecipheriv(algorithm, keyBuf, iv);
      decipher.setAuthTag(authTag);
      const decrypted = Buffer.concat([decipher.update(encryptedBuf), decipher.final()]);
      return decrypted.toString('utf8');
    } catch {
      throw new Error('Decryption failed');
    }
  },

  generateKey: (): string => crypto.randomBytes(32).toString('hex'),
};

/* ---------------------------- Audit logging --------------------------- */
export const auditLogging = {
  logSecurityEvent: (event: {
    type: 'login' | 'logout' | 'failed_login' | 'api_access' | 'suspicious_activity' | string;
    userId?: string;
    ip?: string;
    userAgent?: string;
    details?: any;
  }) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event,
    };
    // In prod send to a logging service; here we console.log for debugging.
    console.log('SECURITY_EVENT:', JSON.stringify(logEntry));
  },

  logApiAccess: (req: { headers?: any; ip?: string; url?: string; method?: string; statusCode?: number }, res?: { statusCode?: number }) => {
    auditLogging.logSecurityEvent({
      type: 'api_access',
      userId: req.headers?.['x-user-id'],
      ip: req.ip,
      userAgent: req.headers?.['user-agent'],
      details: {
        method: req.method,
        path: req.url,
        statusCode: res?.statusCode ?? req.statusCode,
      },
    });
  },
};

/* ----------------------------- Export default ------------------------- */
const securityUtils = {
  sanitization,
  csrfProtection,
  requestValidation,
  sessionSecurity,
  apiSecurity,
  csp,
  encryption,
  auditLogging,
};

export default securityUtils;
