import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>AgentClinic</title></head>
<body><h1>AgentClinic</h1></body>
</html>`)
})

serve({ fetch: app.fetch, port: 3000 })
