import { Kysely, SqliteDialect } from 'kysely'
import Database from 'better-sqlite3'
import type { UserTable } from '../entities/user.entity.js'
import type { Email } from '../entities/mail.entity.js'

interface DB {
  users: UserTable
  emails: Email
}

let dbInstance: Kysely<DB> | null = null
let sqliteInstance: Database.Database | null = null

export function getDB() {
  if (!dbInstance) {
    sqliteInstance = new Database('sqlite.db')
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
