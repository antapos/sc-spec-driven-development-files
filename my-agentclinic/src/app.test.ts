import { describe, it, expect } from 'vitest'
import { app } from './app'

describe('GET /', () => {
  it('returns 200', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
  })

  it('returns HTML containing AgentClinic', async () => {
    const res = await app.request('/')
    const body = await res.text()
    expect(body).toContain('AgentClinic')
  })

  it('includes viewport meta tag', async () => {
    const res = await app.request('/')
    const body = await res.text()
    expect(body).toContain('width=device-width')
  })
})
