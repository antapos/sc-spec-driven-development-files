import { Hono } from 'hono'
import db from '../db'

type Therapy = { id: number; name: string; description: string; duration_minutes: number }

export const therapies = new Hono()

therapies.get('/', (c) => c.json(db.prepare('SELECT * FROM therapies').all()))

therapies.get('/:id', (c) => {
  const row = db.prepare('SELECT * FROM therapies WHERE id = ?').get(c.req.param('id'))
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(row)
})

therapies.post('/', async (c) => {
  let body: Omit<Therapy, 'id'>
  try { body = await c.req.json<Omit<Therapy, 'id'>>() } catch { return c.json({ error: 'Invalid JSON' }, 400) }
  const { name, description, duration_minutes } = body
  if (!name || !description || duration_minutes == null) return c.json({ error: 'Missing required fields' }, 400)
  const result = db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)').run(name, description, duration_minutes)
  return c.json(db.prepare('SELECT * FROM therapies WHERE id = ?').get(result.lastInsertRowid), 201)
})

therapies.put('/:id', async (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM therapies WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  let body: Omit<Therapy, 'id'>
  try { body = await c.req.json<Omit<Therapy, 'id'>>() } catch { return c.json({ error: 'Invalid JSON' }, 400) }
  const { name, description, duration_minutes } = body
  if (!name || !description || duration_minutes == null) return c.json({ error: 'Missing required fields' }, 400)
  db.prepare('UPDATE therapies SET name = ?, description = ?, duration_minutes = ? WHERE id = ?').run(name, description, duration_minutes, id)
  return c.json(db.prepare('SELECT * FROM therapies WHERE id = ?').get(id))
})

therapies.delete('/:id', (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM therapies WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  try {
    db.prepare('DELETE FROM therapies WHERE id = ?').run(id)
  } catch {
    return c.json({ error: 'Cannot delete: therapy has appointments' }, 409)
  }
  return c.json({ deleted: true })
})
