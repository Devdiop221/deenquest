import { Context, Next } from 'hono';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function createSecurityMiddleware() {
  return async (c: Context, next: Next) => {
    // Security headers
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-Frame-Options', 'DENY');
    c.header('X-XSS-Protection', '1; mode=block');
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (process.env.NODE_ENV === 'production') {
      c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    await next();
  };
}

export function createRateLimitMiddleware(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  return async (c: Context, next: Next) => {
    const clientIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (data.resetTime < now) {
        rateLimitStore.delete(ip);
      }
    }

    const clientData = rateLimitStore.get(clientIp);

    if (!clientData) {
      rateLimitStore.set(clientIp, { count: 1, resetTime: now + windowMs });
    } else if (clientData.resetTime < now) {
      rateLimitStore.set(clientIp, { count: 1, resetTime: now + windowMs });
    } else {
      clientData.count++;

      if (clientData.count > maxRequests) {
        return c.json(
          {
            error: 'Too many requests',
            retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
          },
          429
        );
      }
    }

    // Add rate limit headers
    const remaining = Math.max(0, maxRequests - (clientData?.count || 0));
    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header('X-RateLimit-Remaining', remaining.toString());
    c.header('X-RateLimit-Reset', Math.ceil((clientData?.resetTime || now + windowMs) / 1000).toString());

    await next();
  };
}

export function validateEnvironment() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production') {
    const productionEnvVars = [
      'CORS_ORIGIN',
      'METRICS_SECRET',
    ];

    const missingProd = productionEnvVars.filter(envVar => !process.env[envVar]);

    if (missingProd.length > 0) {
      console.warn('Missing recommended production environment variables:', missingProd);
    }
  }
}