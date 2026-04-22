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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AgentClinic</title>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          body { margin: 0; padding: 1rem; max-width: 60rem; margin-inline: auto; }
        `}</style>
      </head>
      <body>
        <Header />
        <Main>Welcome to AgentClinic</Main>
        <Footer />
      </body>
    </html>
  )
})
