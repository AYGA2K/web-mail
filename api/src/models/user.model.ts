import bcrypt from "bcryptjs";
import { getDB } from "../database/db.js";
import { sign, verify } from "hono/jwt";
import type { User } from "../entities/user.entity.js";
import type { CreateUserDto } from "../schemas/user/request/create.schema.js";
import type { CreateUserResponseDto } from "../schemas/user/response/create.schema.js";

export class UserModel {
  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const db = getDB();
    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const created_at = new Date().toISOString();

    const userNameExists = await this.userNameExists(createUserDto.user_name);
    if (userNameExists) {
      throw new Error("Username already exists");
    }

    const email = createUserDto.user_name + "@" + process.env.DOMAINE_NAME;

    try {
      await db
        .insertInto("users")
        .values({
          id,
          email,
          user_name: createUserDto.user_name,
          first_name: createUserDto.first_name,
          last_name: createUserDto.last_name,
          password: hashedPassword,
          created_at,
        })
        .executeTakeFirst();

      return {
        id,
        email,
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        created_at,
      };
    } catch (error) {
      console.error("Error inserting user into DB:", error);
      throw new Error("Internal server error. Could not create user.");
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const db = getDB();
      const user = await db
        .selectFrom("users")
        .selectAll()
        .where("email", "=", email)
        .executeTakeFirst();
      return user ?? undefined;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("Internal server error while fetching user.");
    }
  }

  async verifyCredentials(
    email: string,
    password: string,
  ): Promise<CreateUserResponseDto | null> {
    try {
      const user = await this.findByEmail(email);
      if (!user || !user.password) return null;

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return null;

      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        created_at: user.created_at!,
      };
    } catch (error) {
      console.error("Error verifying credentials:", error);
      throw new Error("Failed to verify credentials.");
    }
  }

  async generateAuthToken(user: CreateUserResponseDto): Promise<string> {
    if (!user.id || !user.email) {
      throw new Error("Invalid user data for token generation.");
    }

    const payload = {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
    };

    try {
      return await sign(payload, process.env.JWT_SECRET!);
    } catch (error) {
      console.error("Error signing JWT token:", error);
      throw new Error("Failed to generate authentication token.");
    }
  }

  async verifyToken(token: string): Promise<CreateUserResponseDto | null> {
    try {
      const decoded = (await verify(
        token,
        process.env.JWT_SECRET!,
      )) as CreateUserResponseDto;
      return decoded;
    } catch (error) {
      console.warn("Invalid or expired token:", error);
      return null;
    }
  }

  async userNameExists(user_name: string): Promise<boolean> {
    try {
      const db = getDB();
      const user = await db
        .selectFrom("users")
        .selectAll()
        .where("user_name", "=", user_name)
        .executeTakeFirst();

      return user !== undefined;
    } catch (error) {
      console.error("Error checking username existence:", error);
      throw new Error("Failed to check if username exists.");
    }
  }
}
