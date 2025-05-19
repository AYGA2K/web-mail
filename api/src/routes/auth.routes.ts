import { OpenAPIHono } from "@hono/zod-openapi";
import { AuthController } from "../controllers/auth.controller.js";
import { buildOpenAPIRoute } from "../utils/openapi.util.js";
import { createUserSchema } from "../schemas/user/request/create.schema.js";
import { loginUserSchema } from "../schemas/user/request/login.schema.js";

const authRoutes = new OpenAPIHono();
const authController = new AuthController();

authRoutes.openapi(
  buildOpenAPIRoute({
    name: "Auth",
    method: "post",
    path: "/register",
    summary: "Register a new user",
    description: "User registered",
    schema: createUserSchema,
  }),
  authController.register,
);

authRoutes.openapi(
  buildOpenAPIRoute({
    name: "Auth",
    method: "post",
    path: "/login",
    summary: "Log in a user",
    description: "Login successful",
    schema: loginUserSchema,
  }),
  authController.login,
);

authRoutes.openapi(
  buildOpenAPIRoute({
    name: "Auth",
    method: "get",
    path: "/me",
    summary: "Get current user info",
    description: "Current user data",
  }),
  authController.me,
);

export default authRoutes;
