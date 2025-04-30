import { Kysely, SqliteDialect } from 'kysely'
import Database from 'better-sqlite3'
import type { Email } from '../entities/mail.entity.js'
import type { User } from '../entities/user.entity.js'

interface DB {
  users: User
  emails: Email
}

let dbInstance: Kysely<DB> | null = null
let sqliteInstance: Database.Database | null = null

export function getDB() {
  if (!dbInstance) {
    const dbName = process.env.DATABASE_NAME || 'webmail.db'
    sqliteInstance = new Database(dbName)
    dbInstance = new Kysely<DB>({
      dialect: new SqliteDialect({ database: sqliteInstance })
    })
  }
  return dbInstance
}

export function disconnectDB() {
  if (sqliteInstance) {
    sqliteInstance.close()
    sqliteInstance = null
  }
  dbInstance = null
}
