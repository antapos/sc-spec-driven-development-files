import { describe, it, expect, beforeEach } from 'vitest'
import { app } from '../app'
import db from '../db'

beforeEach(() => {
  db.exec('DELETE FROM appointments')
  db.exec('DELETE FROM agents')
  db.exec('DELETE FROM ailments')
  db.exec('DELETE FROM therapies')
})

describe('GET /api/agents', () => {
  it('returns 200 and empty array when no agents', async () => {
    const res = await app.request('/api/agents')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  it('returns all agents', async () => {
    db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)').run('Agent X', 'model-x', 'admitted')
    const res = await app.request('/api/agents')
    const body = await res.json() as { name: string }[]
    expect(body).toHaveLength(1)
    expect(body[0].name).toBe('Agent X')
  })
})

describe('POST /api/agents', () => {
  it('creates an agent and returns 201', async () => {
    const res = await app.request('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Agent', model: 'test-model', status: 'admitted' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json() as { id: number; name: string; model: string; status: string }
    expect(body.name).toBe('Test Agent')
    expect(body.model).toBe('test-model')
    expect(body.status).toBe('admitted')
    expect(body.id).toBeDefined()
  })

  it('returns 400 for missing required fields', async () => {
    const res = await app.request('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid JSON', async () => {
    const res = await app.request('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/agents/:id', () => {
  it('returns 200 and the agent when found', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)').run('Agent X', 'model-x', 'admitted')
    const res = await app.request(`/api/agents/${lastInsertRowid}`)
    expect(res.status).toBe(200)
    expect((await res.json() as { name: string }).name).toBe('Agent X')
  })

  it('returns 404 when not found', async () => {
    expect((await app.request('/api/agents/99999')).status).toBe(404)
  })
})

describe('PUT /api/agents/:id', () => {
  it('updates and returns the full agent shape', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)').run('Old Name', 'model-x', 'admitted')
    const res = await app.request(`/api/agents/${lastInsertRowid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Name', model: 'model-x', status: 'recovering' }),
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ id: Number(lastInsertRowid), name: 'New Name', model: 'model-x', status: 'recovering' })
  })

  it('returns 404 when not found', async () => {
    const res = await app.request('/api/agents/99999', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'X', model: 'x', status: 'admitted' }),
    })
    expect(res.status).toBe(404)
  })

  it('returns 400 for missing required fields', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)').run('Agent', 'model-x', 'admitted')
    const res = await app.request(`/api/agents/${lastInsertRowid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/agents/:id', () => {
  it('deletes the agent and returns 200', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)').run('To Delete', 'model-x', 'admitted')
    expect((await app.request(`/api/agents/${lastInsertRowid}`, { method: 'DELETE' })).status).toBe(200)
    expect((await app.request(`/api/agents/${lastInsertRowid}`)).status).toBe(404)
  })

  it('returns 404 when not found', async () => {
    expect((await app.request('/api/agents/99999', { method: 'DELETE' })).status).toBe(404)
  })

  it('returns 409 when agent has appointments', async () => {
    const { lastInsertRowid: agentId } = db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)').run('Busy Agent', 'model-x', 'admitted')
    const { lastInsertRowid: ailmentId } = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)').run('Ailment', 'desc.')
    const { lastInsertRowid: therapyId } = db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)').run('Therapy', 'desc.', 30)
    db.prepare('INSERT INTO appointments (agent_id, ailment_id, therapy_id, scheduled_at, status) VALUES (?, ?, ?, ?, ?)').run(agentId, ailmentId, therapyId, '2026-05-01T10:00:00', 'scheduled')
    expect((await app.request(`/api/agents/${agentId}`, { method: 'DELETE' })).status).toBe(409)
  })
})
