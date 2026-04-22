import { describe, it, expect, beforeEach } from 'vitest'
import { app } from '../app'
import db from '../db'

beforeEach(() => {
  db.exec('DELETE FROM appointments')
  db.exec('DELETE FROM therapies')
})

describe('GET /api/therapies', () => {
  it('returns 200 and a JSON array', async () => {
    const res = await app.request('/api/therapies')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
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
    const body = await res.json() as { id: number; name: string; duration_minutes: number }
    expect(body.name).toBe('Grounding Meditation')
    expect(body.duration_minutes).toBe(30)
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
  it('updates and returns the therapy', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)').run('Old', 'Old.', 30)
    const res = await app.request(`/api/therapies/${lastInsertRowid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated', description: 'Updated.', duration_minutes: 60 }),
    })
    expect(res.status).toBe(200)
    expect((await res.json() as { duration_minutes: number }).duration_minutes).toBe(60)
  })

  it('returns 404 when not found', async () => {
    const res = await app.request('/api/therapies/99999', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'X', description: 'X', duration_minutes: 1 }),
    })
    expect(res.status).toBe(404)
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
