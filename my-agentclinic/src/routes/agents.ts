import { Hono } from 'hono'
import db from '../db'

type Agent = { id: number; name: string; model: string; status: string }

export const agents = new Hono()

agents.get('/', (c) => c.json(db.prepare('SELECT * FROM agents').all()))

agents.get('/:id', (c) => {
  const row = db.prepare('SELECT * FROM agents WHERE id = ?').get(c.req.param('id'))
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(row)
})

agents.post('/', async (c) => {
  const { name, model, status } = await c.req.json<Omit<Agent, 'id'>>()
  const result = db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)').run(name, model, status)
  return c.json(db.prepare('SELECT * FROM agents WHERE id = ?').get(result.lastInsertRowid), 201)
})

agents.put('/:id', async (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM agents WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  const { name, model, status } = await c.req.json<Omit<Agent, 'id'>>()
  db.prepare('UPDATE agents SET name = ?, model = ?, status = ? WHERE id = ?').run(name, model, status, id)
  return c.json(db.prepare('SELECT * FROM agents WHERE id = ?').get(id))
})

agents.delete('/:id', (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM agents WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  db.prepare('DELETE FROM agents WHERE id = ?').run(id)
  return c.json({ deleted: true })
})
