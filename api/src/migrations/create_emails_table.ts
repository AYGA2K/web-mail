import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("emails")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("from", "text", (col) => col.notNull())
    .addColumn("to", "text", (col) => col.notNull())
    .addColumn("subject", "text", (col) => col.notNull())
    .addColumn("body", "text", (col) => col.notNull())
    .addColumn("is_read", "boolean", (col) => col.notNull())
    .addColumn("user_id", "text", (col) => col.references("users.id"))
    .addColumn("created_at", "date", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "date")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
}
