import { describe, it, expect, beforeEach } from 'vitest'
import { app } from '../app'
import db from '../db'

beforeEach(() => {
  db.exec('DELETE FROM appointments')
  db.exec('DELETE FROM ailments')
})

describe('GET /api/ailments', () => {
  it('returns 200 and a JSON array', async () => {
    const res = await app.request('/api/ailments')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
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
    const body = await res.json() as { id: number; name: string }
    expect(body.name).toBe('Context Collapse')
    expect(body.id).toBeDefined()
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
  it('updates and returns the ailment', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)').run('Old Name', 'Old desc.')
    const res = await app.request(`/api/ailments/${lastInsertRowid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Name', description: 'New desc.' }),
    })
    expect(res.status).toBe(200)
    expect((await res.json() as { name: string }).name).toBe('New Name')
  })

  it('returns 404 when not found', async () => {
    const res = await app.request('/api/ailments/99999', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'X', description: 'X' }),
    })
    expect(res.status).toBe(404)
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
