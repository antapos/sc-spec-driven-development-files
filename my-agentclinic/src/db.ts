import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join } from 'path'

const dbPath = process.env['DATABASE_URL'] ?? 'agentclinic.db'
const db = new Database(dbPath)
db.exec(readFileSync(join(process.cwd(), 'schema.sql'), 'utf-8'))

export default db
