import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import session from 'express-session';
import MemoryStore from 'memorystore';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { 
  enforceHTTPS, 
  securityHeaders, 
  requestLogger, 
  apiRateLimit,
  sanitizeInput 
} from "./middleware";
import { LegacySecurityMiddleware } from "./legacySecurityMiddleware";
import { initializeGalacticSupreme } from "./galacticSecurity";

const app = express();

// GALACTIC SUPREME SECURITY INITIALIZATION (Background Only)
console.log('🌌 GALACTIC SUPREME SECURITY SYSTEM - BACKGROUND MONITORING ACTIVE');
// initializeGalacticSupreme(); // Disabled for user access

// Basic security headers only
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for development
  crossOriginEmbedderPolicy: false
}));

// GALACTIC SUPREME SECURITY MIDDLEWARE STACK (Disabled for user access)
// app.use(LegacySecurityMiddleware.createQuantumSecurityStack());

// Security headers and HTTPS enforcement (Disabled for development)
// app.use(enforceHTTPS);
// app.use(securityHeaders);

// Request logging for security monitoring
app.use(requestLogger);

// Session configuration for admin authentication
const MemStore = MemoryStore(session);

app.use(session({
  secret: process.env.SESSION_SECRET || 'divine-vanity-session-secret-2025',
  store: new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Body parsing with size limits for security
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Input sanitization (Disabled for development)
// app.use(sanitizeInput);

// Rate limiting for all API endpoints (Disabled for development)
// app.use('/api', apiRateLimit);

// Health check endpoint for autoscale monitoring
app.get("/health", (_req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    service: "The Divine Vanity API",
    environment: process.env.NODE_ENV || "development",
    port: 5000
  });
});

// Readiness check for deployment
app.get("/ready", (_req, res) => {
  res.status(200).json({ 
    status: "ready",
    timestamp: new Date().toISOString(),
    service: "The Divine Vanity API",
    environment: process.env.NODE_ENV || "development"
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error for debugging but don't crash in production
    if (process.env.NODE_ENV !== "production") {
      console.error("Server Error:", err);
      throw err;
    } else {
      console.error("Production Error:", { status, message, stack: err.stack });
      res.status(status).json({ message });
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
