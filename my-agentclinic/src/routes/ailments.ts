import { Hono } from 'hono'
import db from '../db'

type Ailment = { id: number; name: string; description: string }

export const ailments = new Hono()

ailments.get('/', (c) => c.json(db.prepare('SELECT * FROM ailments').all()))

ailments.get('/:id', (c) => {
  const row = db.prepare('SELECT * FROM ailments WHERE id = ?').get(c.req.param('id'))
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(row)
})

ailments.post('/', async (c) => {
  let body: Omit<Ailment, 'id'>
  try { body = await c.req.json<Omit<Ailment, 'id'>>() } catch { return c.json({ error: 'Invalid JSON' }, 400) }
  const { name, description } = body
  if (!name || !description) return c.json({ error: 'Missing required fields' }, 400)
  const result = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)').run(name, description)
  return c.json(db.prepare('SELECT * FROM ailments WHERE id = ?').get(result.lastInsertRowid), 201)
})

ailments.put('/:id', async (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM ailments WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  let body: Omit<Ailment, 'id'>
  try { body = await c.req.json<Omit<Ailment, 'id'>>() } catch { return c.json({ error: 'Invalid JSON' }, 400) }
  const { name, description } = body
  if (!name || !description) return c.json({ error: 'Missing required fields' }, 400)
  db.prepare('UPDATE ailments SET name = ?, description = ? WHERE id = ?').run(name, description, id)
  return c.json(db.prepare('SELECT * FROM ailments WHERE id = ?').get(id))
})

ailments.delete('/:id', (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM ailments WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  try {
    db.prepare('DELETE FROM ailments WHERE id = ?').run(id)
  } catch {
    return c.json({ error: 'Cannot delete: ailment has appointments' }, 409)
  }
  return c.json({ deleted: true })
})
