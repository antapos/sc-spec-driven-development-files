import { Hono } from 'hono'
import db from '../db'

type Appointment = {
  id: number
  agent_id: number
  ailment_id: number
  therapy_id: number
  scheduled_at: string
  status: string
}

export const appointments = new Hono()

appointments.get('/', (c) => c.json(db.prepare('SELECT * FROM appointments').all()))

appointments.get('/:id', (c) => {
  const row = db.prepare('SELECT * FROM appointments WHERE id = ?').get(c.req.param('id'))
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(row)
})

appointments.post('/', async (c) => {
  const { agent_id, ailment_id, therapy_id, scheduled_at, status } = await c.req.json<Omit<Appointment, 'id'>>()
  const result = db.prepare(
    'INSERT INTO appointments (agent_id, ailment_id, therapy_id, scheduled_at, status) VALUES (?, ?, ?, ?, ?)'
  ).run(agent_id, ailment_id, therapy_id, scheduled_at, status)
  return c.json(db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid), 201)
})

appointments.put('/:id', async (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM appointments WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  const { agent_id, ailment_id, therapy_id, scheduled_at, status } = await c.req.json<Omit<Appointment, 'id'>>()
  db.prepare(
    'UPDATE appointments SET agent_id = ?, ailment_id = ?, therapy_id = ?, scheduled_at = ?, status = ? WHERE id = ?'
  ).run(agent_id, ailment_id, therapy_id, scheduled_at, status, id)
  return c.json(db.prepare('SELECT * FROM appointments WHERE id = ?').get(id))
})

appointments.delete('/:id', (c) => {
  const id = c.req.param('id')
  if (!db.prepare('SELECT id FROM appointments WHERE id = ?').get(id)) return c.json({ error: 'Not found' }, 404)
  db.prepare('DELETE FROM appointments WHERE id = ?').run(id)
  return c.json({ deleted: true })
})
