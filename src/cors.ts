import { Context, Next } from "hono";
import { cors } from "hono/cors";

export const corsMiddleware = (c: Context, next: Next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS
    ? String(c.env.ALLOWED_ORIGINS)
        .split(",")
        .map((o) => o.trim())
    : [];

  return cors({
    origin: (origin) => (allowedOrigins.includes(origin) ? origin : null),
    allowMethods: ["POST"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
    credentials: true,
  })(c, next);
};
