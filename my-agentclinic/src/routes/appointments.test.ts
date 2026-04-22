import { describe, it, expect, beforeEach } from 'vitest'
import { app } from '../app'
import db from '../db'

let agentId: number
let ailmentId: number
let therapyId: number

beforeEach(() => {
  db.exec('DELETE FROM appointments')
  db.exec('DELETE FROM agents')
  db.exec('DELETE FROM ailments')
  db.exec('DELETE FROM therapies')

  agentId = Number(db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)').run('Test Agent', 'model', 'admitted').lastInsertRowid)
  ailmentId = Number(db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)').run('Test Ailment', 'desc.').lastInsertRowid)
  therapyId = Number(db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)').run('Test Therapy', 'desc.', 30).lastInsertRowid)
})

const newAppt = () => ({
  agent_id: agentId,
  ailment_id: ailmentId,
  therapy_id: therapyId,
  scheduled_at: '2026-05-01T10:00:00',
  status: 'scheduled',
})

describe('GET /api/appointments', () => {
  it('returns 200 and a JSON array', async () => {
    const res = await app.request('/api/appointments')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })
})

describe('POST /api/appointments', () => {
  it('creates an appointment and returns 201', async () => {
    const res = await app.request('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAppt()),
    })
    expect(res.status).toBe(201)
    const body = await res.json() as { id: number; status: string }
    expect(body.status).toBe('scheduled')
    expect(body.id).toBeDefined()
  })
})

describe('GET /api/appointments/:id', () => {
  it('returns 200 and the appointment when found', async () => {
    const { lastInsertRowid } = db.prepare(
      'INSERT INTO appointments (agent_id, ailment_id, therapy_id, scheduled_at, status) VALUES (?, ?, ?, ?, ?)'
    ).run(agentId, ailmentId, therapyId, '2026-05-01T10:00:00', 'scheduled')
    const res = await app.request(`/api/appointments/${lastInsertRowid}`)
    expect(res.status).toBe(200)
    expect((await res.json() as { status: string }).status).toBe('scheduled')
  })

  it('returns 404 when not found', async () => {
    expect((await app.request('/api/appointments/99999')).status).toBe(404)
  })
})

describe('PUT /api/appointments/:id', () => {
  it('updates and returns the appointment', async () => {
    const { lastInsertRowid } = db.prepare(
      'INSERT INTO appointments (agent_id, ailment_id, therapy_id, scheduled_at, status) VALUES (?, ?, ?, ?, ?)'
    ).run(agentId, ailmentId, therapyId, '2026-05-01T10:00:00', 'scheduled')
    const res = await app.request(`/api/appointments/${lastInsertRowid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newAppt(), status: 'completed' }),
    })
    expect(res.status).toBe(200)
    expect((await res.json() as { status: string }).status).toBe('completed')
  })

  it('returns 404 when not found', async () => {
    const res = await app.request('/api/appointments/99999', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAppt()),
    })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/appointments/:id', () => {
  it('deletes the appointment and returns 200', async () => {
    const { lastInsertRowid } = db.prepare(
      'INSERT INTO appointments (agent_id, ailment_id, therapy_id, scheduled_at, status) VALUES (?, ?, ?, ?, ?)'
    ).run(agentId, ailmentId, therapyId, '2026-05-01T10:00:00', 'scheduled')
    expect((await app.request(`/api/appointments/${lastInsertRowid}`, { method: 'DELETE' })).status).toBe(200)
    expect((await app.request(`/api/appointments/${lastInsertRowid}`)).status).toBe(404)
  })

  it('returns 404 when not found', async () => {
    expect((await app.request('/api/appointments/99999', { method: 'DELETE' })).status).toBe(404)
  })
})
