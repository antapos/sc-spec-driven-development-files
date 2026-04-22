import { describe, it, expect, beforeEach } from 'vitest'
import { app } from '../app'
import db from '../db'

beforeEach(() => {
  db.exec('DELETE FROM appointments')
  db.exec('DELETE FROM agents')
  db.exec('DELETE FROM ailments')
  db.exec('DELETE FROM therapies')
})

describe('GET /api/ailments', () => {
  it('returns 200 and empty array when no ailments', async () => {
    const res = await app.request('/api/ailments')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  it('returns all ailments', async () => {
    db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)').run('Token Anxiety', 'desc.')
    const res = await app.request('/api/ailments')
    const body = await res.json() as { name: string }[]
    expect(body).toHaveLength(1)
    expect(body[0].name).toBe('Token Anxiety')
  })
})

describe('POST /api/ailments', () => {
  it('creates an ailment and returns 201', async () => {
    const res = await app.request('/api/ailments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Context Collapse', description: 'Loss of context.' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json() as { id: number; name: string; description: string }
    expect(body.name).toBe('Context Collapse')
    expect(body.description).toBe('Loss of context.')
    expect(body.id).toBeDefined()
  })

  it('returns 400 for missing required fields', async () => {
    const res = await app.request('/api/ailments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid JSON', async () => {
    const res = await app.request('/api/ailments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/ailments/:id', () => {
  it('returns 200 and the ailment when found', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)').run('Token Anxiety', 'Stress about tokens.')
    const res = await app.request(`/api/ailments/${lastInsertRowid}`)
    expect(res.status).toBe(200)
    expect((await res.json() as { name: string }).name).toBe('Token Anxiety')
  })

  it('returns 404 when not found', async () => {
    expect((await app.request('/api/ailments/99999')).status).toBe(404)
  })
})

describe('PUT /api/ailments/:id', () => {
  it('updates and returns the full ailment shape', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)').run('Old Name', 'Old desc.')
    const res = await app.request(`/api/ailments/${lastInsertRowid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Name', description: 'New desc.' }),
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ id: Number(lastInsertRowid), name: 'New Name', description: 'New desc.' })
  })

  it('returns 404 when not found', async () => {
    const res = await app.request('/api/ailments/99999', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'X', description: 'X' }),
    })
    expect(res.status).toBe(404)
  })

  it('returns 400 for missing required fields', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)').run('Ailment', 'desc.')
    const res = await app.request(`/api/ailments/${lastInsertRowid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/ailments/:id', () => {
  it('deletes the ailment and returns 200', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)').run('To Delete', 'desc.')
    expect((await app.request(`/api/ailments/${lastInsertRowid}`, { method: 'DELETE' })).status).toBe(200)
    expect((await app.request(`/api/ailments/${lastInsertRowid}`)).status).toBe(404)
  })

  it('returns 404 when not found', async () => {
    expect((await app.request('/api/ailments/99999', { method: 'DELETE' })).status).toBe(404)
  })
})
