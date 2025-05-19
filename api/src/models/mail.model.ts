import { getDB } from "../database/db.js";
import type { CreateEmailMultipleRecipientsDto } from "../schemas/emails/request/create-multiple.schema.js";
import type { CreateEmailDto } from "../schemas/emails/request/create.schema.js";
import type { CreateEmailResponseDto } from "../schemas/emails/response/create.schema.js";
import type { listEmailResponseDto } from "../schemas/emails/response/list.schema.js";
import type { FindOptions } from "../types/sql-options.js";

export class MailModel {
  async create(
    createEmailDto: CreateEmailDto,
  ): Promise<CreateEmailResponseDto> {
    try {
      const db = getDB();
      const id = crypto.randomUUID();
      const created_at = new Date().toISOString();

      await db
        .insertInto("emails")
        .values({
          id,
          from: createEmailDto.from,
          to: createEmailDto.to,
          subject: createEmailDto.subject,
          body: createEmailDto.body,
          is_read: 0,
          user_id: createEmailDto.user_id,
          created_at,
        })
        .execute();

      return {
        id,
        from: createEmailDto.from,
        to: createEmailDto.to,
        subject: createEmailDto.subject,
        body: createEmailDto.body,
        created_at,
        isRead: false,
        userId: createEmailDto.user_id,
      };
    } catch (error) {
      console.error("Error in MailModel.create:", error);
      throw error;
    }
  }

  async createForMultipleRecipients(
    createEmailDto: CreateEmailMultipleRecipientsDto,
  ): Promise<CreateEmailResponseDto[]> {
    try {
      const db = getDB();
      const results: CreateEmailResponseDto[] = [];

      for (const recipient of createEmailDto.to) {
        const id = crypto.randomUUID();
        const created_at = new Date().toISOString();
        await db
          .insertInto("emails")
          .values({
            id,
            from: createEmailDto.from,
            to: recipient,
            subject: createEmailDto.subject,
            body: createEmailDto.body,
            is_read: 0,
            user_id: createEmailDto.user_id,
            created_at,
          })
          .execute();

        results.push({
          id,
          from: createEmailDto.from,
          to: recipient,
          subject: createEmailDto.subject,
          body: createEmailDto.body,
          created_at,
          isRead: false,
          userId: createEmailDto.user_id,
        });
      }

      return results;
    } catch (error) {
      console.error("Error in MailModel.createForMultipleRecipients:", error);
      throw error;
    }
  }

  async findByUser(userId: string): Promise<listEmailResponseDto[]> {
    try {
      const db = getDB();
      return await db
        .selectFrom("emails")
        .selectAll()
        .where("user_id", "=", userId)
        .execute();
    } catch (error) {
      console.error("Error in MailModel.findByUser:", error);
      throw error;
    }
  }

  async findWhere(options: FindOptions = {}): Promise<listEmailResponseDto[]> {
    try {
      const db = getDB();

      let query = db
        .selectFrom("emails")
        .select([
          "id",
          "from",
          "to",
          "subject",
          "body",
          "is_read",
          "user_id",
          "reply_to",
          "created_at",
          "updated_at",
        ]);

      if (options.conditions?.length) {
        for (const condition of options.conditions) {
          if (condition.operator === "in" && Array.isArray(condition.value)) {
            query = query.where(condition.column, "in", condition.value);
          } else {
            query = query.where(
              condition.column,
              condition.operator as any,
              condition.value,
            );
          }
        }
      }

      if (options.groupBy?.length) {
        query = query.groupBy(options.groupBy);
      }

      if (options.orderBy?.length) {
        for (const sort of options.orderBy) {
          query = query.orderBy(sort.column, sort.direction);
        }
      }

      query = query.limit(options.limit ?? 10).offset(options.offset ?? 0);

      return await query.execute();
    } catch (error) {
      console.error("Error in MailModel.findWhere:", error);
      throw error;
    }
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<listEmailResponseDto | undefined> {
    try {
      const db = getDB();
      const email = await db
        .selectFrom("emails")
        .selectAll()
        .where("id", "=", id)
        .where("user_id", "=", userId)
        .executeTakeFirst();

      return email ?? undefined;
    } catch (error) {
      console.error("Error in MailModel.findById:", error);
      throw error;
    }
  }

  async markAsRead(
    id: string,
    userId: string,
  ): Promise<listEmailResponseDto | undefined> {
    try {
      const db = getDB();
      const email = await db
        .selectFrom("emails")
        .selectAll()
        .where("id", "=", id)
        .where("user_id", "=", userId)
        .executeTakeFirst();

      if (email) {
        await db
          .updateTable("emails")
          .set({ is_read: 1 })
          .where("id", "=", id)
          .where("user_id", "=", userId)
          .execute();

        email.is_read = 1;
        return email;
      }

      return undefined;
    } catch (error) {
      console.error("", error);
      throw error;
    }
  }

  async delete(id: string, userId: string): Promise<boolean> {
    try {
      const db = getDB();
      const result = await db
        .deleteFrom("emails")
        .where("id", "=", id)
        .where("user_id", "=", userId)
        .execute();

      return result.length > 0;
    } catch (error) {
      console.error("Error in MailModel.delete:", error);
      throw error;
    }
  }
}
