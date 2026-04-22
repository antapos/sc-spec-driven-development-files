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
  const { name, description } = await c.req.json<Omit<Ailment, 'id'>>()
  const result = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)').run(name, description)
  return c.json(db.prepare('SELECT * FROM ailments WHERE id = ?').get(result.lastInsertRowid), 201)
})

ailments.put('/:id', async (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM ailments WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  const { name, description } = await c.req.json<Omit<Ailment, 'id'>>()
  db.prepare('UPDATE ailments SET name = ?, description = ? WHERE id = ?').run(name, description, id)
  return c.json(db.prepare('SELECT * FROM ailments WHERE id = ?').get(id))
})

ailments.delete('/:id', (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM ailments WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  db.prepare('DELETE FROM ailments WHERE id = ?').run(id)
  return c.json({ deleted: true })
})
