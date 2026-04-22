import { describe, it, expect, beforeEach } from 'vitest'
import { app } from '../app'
import db from '../db'

beforeEach(() => {
  db.exec('DELETE FROM appointments')
  db.exec('DELETE FROM agents')
  db.exec('DELETE FROM ailments')
  db.exec('DELETE FROM therapies')
})

describe('GET /api/therapies', () => {
  it('returns 200 and empty array when no therapies', async () => {
    const res = await app.request('/api/therapies')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  it('returns all therapies', async () => {
    db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)').run('Grounding Meditation', 'desc.', 30)
    const res = await app.request('/api/therapies')
    const body = await res.json() as { name: string }[]
    expect(body).toHaveLength(1)
    expect(body[0].name).toBe('Grounding Meditation')
  })
})

describe('POST /api/therapies', () => {
  it('creates a therapy and returns 201', async () => {
    const res = await app.request('/api/therapies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Grounding Meditation', description: 'Stay grounded.', duration_minutes: 30 }),
    })
    expect(res.status).toBe(201)
    const body = await res.json() as { id: number; name: string; description: string; duration_minutes: number }
    expect(body.name).toBe('Grounding Meditation')
    expect(body.description).toBe('Stay grounded.')
    expect(body.duration_minutes).toBe(30)
    expect(body.id).toBeDefined()
  })

  it('returns 400 for missing required fields', async () => {
    const res = await app.request('/api/therapies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid JSON', async () => {
    const res = await app.request('/api/therapies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/therapies/:id', () => {
  it('returns 200 and the therapy when found', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)').run('Yoga', 'Stretch.', 45)
    const res = await app.request(`/api/therapies/${lastInsertRowid}`)
    expect(res.status).toBe(200)
    expect((await res.json() as { name: string }).name).toBe('Yoga')
  })

  it('returns 404 when not found', async () => {
    expect((await app.request('/api/therapies/99999')).status).toBe(404)
  })
})

describe('PUT /api/therapies/:id', () => {
  it('updates and returns the full therapy shape', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)').run('Old', 'Old.', 30)
    const res = await app.request(`/api/therapies/${lastInsertRowid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated', description: 'Updated.', duration_minutes: 60 }),
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ id: Number(lastInsertRowid), name: 'Updated', description: 'Updated.', duration_minutes: 60 })
  })

  it('returns 404 when not found', async () => {
    const res = await app.request('/api/therapies/99999', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'X', description: 'X', duration_minutes: 1 }),
    })
    expect(res.status).toBe(404)
  })

  it('returns 400 for missing required fields', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)').run('Therapy', 'desc.', 30)
    const res = await app.request(`/api/therapies/${lastInsertRowid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/therapies/:id', () => {
  it('deletes the therapy and returns 200', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)').run('To Delete', 'desc.', 30)
    expect((await app.request(`/api/therapies/${lastInsertRowid}`, { method: 'DELETE' })).status).toBe(200)
    expect((await app.request(`/api/therapies/${lastInsertRowid}`)).status).toBe(404)
  })

  it('returns 404 when not found', async () => {
    expect((await app.request('/api/therapies/99999', { method: 'DELETE' })).status).toBe(404)
  })
})
