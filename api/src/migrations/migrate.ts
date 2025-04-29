import path from 'path'
import { promises as fs } from 'fs'
import { FileMigrationProvider, Migrator } from 'kysely'
import { getDB } from '../database/db.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
async function migrateToLatest() {
  const db = getDB()

  const migrator = new Migrator({
    db,
    allowUnorderedMigrations: true,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  for (const result of results ?? []) {
    if (result.status === 'Success') {
      console.log(`✅ ${result.migrationName} migrated successfully`)
    } else if (result.status === 'Error') {
      console.error(`❌ Failed to migrate ${result.migrationName}`)
      console.log(result)
    }
  }

  if (error) {
    console.error('❌ Migration failed:')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()
