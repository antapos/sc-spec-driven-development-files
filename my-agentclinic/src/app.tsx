import { Hono } from 'hono'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { Main } from './components/main'
import { agents } from './routes/agents'
import { ailments } from './routes/ailments'
import { therapies } from './routes/therapies'
import { appointments } from './routes/appointments'

export const app = new Hono()

app.route('/api/agents', agents)
app.route('/api/ailments', ailments)
app.route('/api/therapies', therapies)
app.route('/api/appointments', appointments)

app.get('/', (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AgentClinic</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
      </head>
      <body>
        <Header />
        <Main>Welcome to AgentClinic</Main>
        <Footer />
      </body>
    </html>
  )
})
