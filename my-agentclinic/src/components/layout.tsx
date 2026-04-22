import type { Child } from 'hono/jsx'
import { Header } from './header'
import { Footer } from './footer'

type Props = { title: string; children: Child }

export function Layout({ title, children }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — AgentClinic</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
      </head>
      <body>
        <Header />
        <main class="container">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
