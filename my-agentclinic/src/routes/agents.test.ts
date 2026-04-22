import { describe, it, expect, beforeEach } from 'vitest'
import { app } from '../app'
import db from '../db'

beforeEach(() => {
  db.exec('DELETE FROM appointments')
  db.exec('DELETE FROM agents')
})

describe('GET /api/agents', () => {
  it('returns 200 and a JSON array', async () => {
    const res = await app.request('/api/agents')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
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
    const body = await res.json() as { id: number; name: string }
    expect(body.name).toBe('Test Agent')
    expect(body.id).toBeDefined()
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
    const res = await app.request('/api/agents/99999')
    expect(res.status).toBe(404)
  })
})

describe('PUT /api/agents/:id', () => {
  it('updates and returns the agent', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)').run('Old Name', 'model-x', 'admitted')
    const res = await app.request(`/api/agents/${lastInsertRowid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Name', model: 'model-x', status: 'recovering' }),
    })
    expect(res.status).toBe(200)
    expect((await res.json() as { name: string; status: string }).status).toBe('recovering')
  })

  it('returns 404 when not found', async () => {
    const res = await app.request('/api/agents/99999', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'X', model: 'x', status: 'admitted' }),
    })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/agents/:id', () => {
  it('deletes the agent and returns 200', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)').run('To Delete', 'model-x', 'admitted')
    const del = await app.request(`/api/agents/${lastInsertRowid}`, { method: 'DELETE' })
    expect(del.status).toBe(200)
    expect((await app.request(`/api/agents/${lastInsertRowid}`)).status).toBe(404)
  })

  it('returns 404 when not found', async () => {
    const res = await app.request('/api/agents/99999', { method: 'DELETE' })
    expect(res.status).toBe(404)
  })
})
