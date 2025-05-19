import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { config } from "./config.js";
import authRoutes from "./routes/auth.routes.js";
import mailRoutes from "./routes/mail.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { SMTPService } from "./services/smtp.service.js";

const basePath = process.env.BASE_PATH ? process.env.BASE_PATH : "/api/v1";
const app = new OpenAPIHono().basePath(basePath);

// Middleware
app.use(logger());
app.use(
  "*",
  cors({
    origin: config.CORS_ORIGINS,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Health check
app.get("/", (c) => c.json({ message: "Webmail API" }));

// OpenAPI documentation
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Webmail API",
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}`,
      description: "Local development server",
    },
  ],
});

// Swagger UI route
app.get(
  "/ui",
  swaggerUI({
    url: "./doc",
  }),
);
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  // scheme: "bearer",
  // bearerFormat: "JWT",
});

// app.use(authMiddleware)

// Register your routes first
app.route("/auth", authRoutes);
app.route("/mail", mailRoutes);

// Error handling
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

// Not found
app.notFound((c) => c.json({ error: "Not found" }, 404));
const smtpService = new SMTPService();
smtpService.start();

// Start server
serve(
  {
    fetch: app.fetch,
    port: config.PORT,
  },
  () => {
    console.log(
      `Server is running on http://localhost:${config.PORT}${basePath}`,
    );
    console.log(`Swagger UI: http://localhost:${config.PORT}${basePath}/ui`);
    console.log(`OpenAPI spec: http://localhost:${config.PORT}${basePath}/doc`);
  },
);
