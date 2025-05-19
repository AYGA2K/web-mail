import type { Context } from "hono";
import { UserModel } from "../models/user.model.js";
import type { CreateUserDto } from "../schemas/user/request/create.schema.js";
import { ApiResponse } from "../utils/response.util.js";

export class AuthController {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  register = async (c: Context) => {
    const createUserDto: CreateUserDto = await c.req.json();

    try {
      const user = await this.userModel.create(createUserDto);
      return ApiResponse.success(c, {
        data: { user },
        message: "User registered successfully",
        status: 201,
      });
    } catch (error: any) {
      return ApiResponse.error(c, {
        status: 400,
        message: error.message,
      });
    }
  };

  login = async (c: Context) => {
    try {
      const { email, password } = await c.req.json();
      const user = await this.userModel.verifyCredentials(email, password);

      if (!user) {
        return ApiResponse.unauthorized(c, "Invalid email or password");
      }

      const token = await this.userModel.generateAuthToken(user);
      return ApiResponse.success(c, {
        data: {
          user: {
            id: user.id,
            email: user.email,
          },
          token,
        },
        message: "Login successful",
      });
    } catch (error) {
      console.error("Login error:", error);
      return ApiResponse.error(c, {
        status: 400,
        message: "Login failed",
      });
    }
  };

  me = async (c: Context) => {
    try {
      const user = c.get("user");

      return ApiResponse.success(c, {
        data: { user },
        message: "User profile retrieved successfully",
      });
    } catch (error) {
      console.error("Me endpoint error:", error);
      return ApiResponse.unauthorized(c);
    }
  };
}
