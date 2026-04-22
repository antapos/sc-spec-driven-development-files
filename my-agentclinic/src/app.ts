import { Hono } from 'hono'

export const app = new Hono()

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>AgentClinic</title></head>
<body><h1>AgentClinic</h1></body>
</html>`)
})
