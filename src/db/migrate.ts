import { join } from 'node:path'
import { cwd } from 'node:process'

import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import { env } from '@/env'

async function exec() {
  const connection = postgres(env.DATABASE_URL, { max: 1 })
  const db = drizzle(connection)

  const migrationsFolder = join(cwd(), 'drizzle')

  await migrate(db, { migrationsFolder })

  console.log('Migrations applied successfully!')

  await connection.end()

  process.exit()
}

exec()
