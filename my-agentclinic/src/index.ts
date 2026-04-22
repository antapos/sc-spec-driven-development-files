import { serve } from '@hono/node-server'
import { seed } from './seed'
import { app } from './app'

seed()
serve({ fetch: app.fetch, port: 3000 })
