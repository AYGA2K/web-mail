import { createMiddleware } from "hono/factory";
import { UserModel } from "../models/user.model.js";

export const authMiddleware = createMiddleware(async (c, next) => {
  const basePath = process.env.BASE_PATH ? process.env.BASE_PATH : "/api/v1";
  if (
    c.req.path === basePath + "/auth/login" ||
    c.req.path === basePath + "/auth/register"
  ) {
    return await next();
  }
  const userModel = new UserModel();
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  const user = await userModel.verifyToken(token);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!userModel.findByEmail(user.email)) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
});
