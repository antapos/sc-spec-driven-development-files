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
  const { name, description, duration_minutes } = await c.req.json<Omit<Therapy, 'id'>>()
  const result = db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)').run(name, description, duration_minutes)
  return c.json(db.prepare('SELECT * FROM therapies WHERE id = ?').get(result.lastInsertRowid), 201)
})

therapies.put('/:id', async (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM therapies WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  const { name, description, duration_minutes } = await c.req.json<Omit<Therapy, 'id'>>()
  db.prepare('UPDATE therapies SET name = ?, description = ?, duration_minutes = ? WHERE id = ?').run(name, description, duration_minutes, id)
  return c.json(db.prepare('SELECT * FROM therapies WHERE id = ?').get(id))
})

therapies.delete('/:id', (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM therapies WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  db.prepare('DELETE FROM therapies WHERE id = ?').run(id)
  return c.json({ deleted: true })
})
