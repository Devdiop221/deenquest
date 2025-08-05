import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { auth } from "./lib/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createMonitoringMiddleware, MonitoringService } from "./lib/monitoring";
import { createSecurityMiddleware, createRateLimitMiddleware, validateEnvironment } from "./lib/security";

// Validate environment variables
validateEnvironment();

const app = new Hono();

app.use(logger());
app.use(createSecurityMiddleware());
app.use(createRateLimitMiddleware());
app.use(createMonitoringMiddleware());
app.use("/*", cors({
  origin: process.env.CORS_ORIGIN || "",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));


app.use("/trpc/*", trpcServer({
  router: appRouter,
  createContext: (_opts, context) => {
    return createContext({ context });
  },
}));



app.get("/", (c) => {
  return c.text("DeenQuest API - OK");
});

// Health check endpoint
app.get("/health", (c) => {
  const monitoring = MonitoringService.getInstance();
  return c.json(monitoring.getHealthStatus());
});

// Metrics endpoint (protected in production)
app.get("/metrics", (c) => {
  if (process.env.NODE_ENV === 'production') {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.METRICS_SECRET}`) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
  }

  const monitoring = MonitoringService.getInstance();
  return c.json({
    metrics: monitoring.getMetrics(),
    errors: monitoring.getRecentErrors(),
    health: monitoring.getHealthStatus(),
  });
});

export default app;
