import { Hono } from 'hono'
import { agents } from './routes/agents'
import { ailments } from './routes/ailments'
import { therapies } from './routes/therapies'
import { appointments } from './routes/appointments'
import { pages } from './routes/pages'
import { Layout } from './components/layout'

export const app = new Hono()

app.route('/api/agents', agents)
app.route('/api/ailments', ailments)
app.route('/api/therapies', therapies)
app.route('/api/appointments', appointments)
app.route('/', pages)

app.notFound((c) => c.html(
  <Layout title="Not Found">
    <h2>404 — Room Not Found</h2>
    <p>This corridor doesn't exist. Perhaps the agent you're looking for has already been discharged.</p>
    <a href="/">Return to reception</a>
  </Layout>,
  404
))

app.onError((err, c) => {
  console.error(err)
  return c.html(
    <Layout title="Error">
      <h2>500 — Internal Error</h2>
      <p>Our systems are experiencing a temporary breakdown. The on-call engineer has been paged.</p>
      <a href="/">Return to reception</a>
    </Layout>,
    500
  )
})
