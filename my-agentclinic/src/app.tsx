import { Hono } from 'hono'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { Main } from './components/main'

export const app = new Hono()

app.get('/', (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>AgentClinic</title>
      </head>
      <body>
        <Header />
        <Main>Welcome to AgentClinic</Main>
        <Footer />
      </body>
    </html>
  )
})
