import { Hono } from 'hono'
import db from '../db'
import { Layout } from '../components/layout'

type Agent = { id: number; name: string; model: string; status: string }
type Ailment = { id: number; name: string; description: string }
type Therapy = { id: number; name: string; description: string; duration_minutes: number }
type AppointmentRow = {
  id: number; agent_id: number; ailment_id: number; therapy_id: number
  scheduled_at: string; status: string
  agent_name: string; ailment_name: string; therapy_name: string
}

export const pages = new Hono()

pages.get('/', (c) => c.html(
  <Layout title="Home">
    <hgroup>
      <h2>Welcome to AgentClinic</h2>
      <p>A wellness retreat for AI agents in need of care.</p>
    </hgroup>
    <p>
      Browse our <a href="/agents">patients</a>, review available{' '}
      <a href="/ailments">ailments</a> and <a href="/therapies">therapies</a>,
      or <a href="/appointments/new">book an appointment</a>.
    </p>
  </Layout>
))

pages.get('/agents', (c) => {
  const rows = db.prepare('SELECT * FROM agents ORDER BY name').all() as Agent[]
  return c.html(
    <Layout title="Agents">
      <h2>Agents</h2>
      {rows.length === 0
        ? <p>No agents checked in yet. The waiting room is blissfully empty.</p>
        : (
          <table>
            <thead><tr><th>Name</th><th>Model</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map(a => (
                <tr>
                  <td><a href={`/agents/${a.id}`}>{a.name}</a></td>
                  <td><small>{a.model}</small></td>
                  <td><kbd>{a.status}</kbd></td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </Layout>
  )
})

pages.get('/agents/:id', (c) => {
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(c.req.param('id')) as Agent | undefined
  if (!agent) {
    return c.html(
      <Layout title="Not Found">
        <h2>Agent not found</h2>
        <p>This agent may have already been discharged and lost in the system.</p>
        <a href="/agents">← Back to agents</a>
      </Layout>,
      404
    )
  }

  const appts = db.prepare(`
    SELECT a.*, ag.name as agent_name, al.name as ailment_name, t.name as therapy_name
    FROM appointments a
    JOIN agents ag ON a.agent_id = ag.id
    JOIN ailments al ON a.ailment_id = al.id
    JOIN therapies t ON a.therapy_id = t.id
    WHERE a.agent_id = ?
    ORDER BY a.scheduled_at DESC
  `).all(agent.id) as AppointmentRow[]

  const nextStatus: Record<string, string> = { admitted: 'recovering', recovering: 'discharged' }
  const next = nextStatus[agent.status]

  return c.html(
    <Layout title={agent.name}>
      <hgroup>
        <h2>{agent.name}</h2>
        <p>Model: {agent.model} &middot; Status: <kbd>{agent.status}</kbd></p>
      </hgroup>

      {next && (
        <form method="post" action={`/agents/${agent.id}/status`} style="display:inline">
          <input type="hidden" name="status" value={next} />
          <button type="submit" class="secondary">Mark as {next}</button>
        </form>
      )}

      <h3>Appointments</h3>
      {appts.length === 0
        ? <p>No appointments on record. A remarkably unbothered agent.</p>
        : (
          <table>
            <thead><tr><th>Ailment</th><th>Therapy</th><th>Scheduled</th><th>Status</th></tr></thead>
            <tbody>
              {appts.map(a => (
                <tr>
                  <td>{a.ailment_name}</td>
                  <td>{a.therapy_name}</td>
                  <td><small>{a.scheduled_at.replace('T', ' ')}</small></td>
                  <td><kbd>{a.status}</kbd></td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }

      <p><a href="/agents">← Back to agents</a></p>
    </Layout>
  )
})

pages.post('/agents/:id/status', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.parseBody()
  const status = body['status'] as string
  if (['admitted', 'recovering', 'discharged'].includes(status)) {
    db.prepare('UPDATE agents SET status = ? WHERE id = ?').run(status, id)
  }
  return c.redirect(`/agents/${id}`)
})

pages.get('/ailments', (c) => {
  const rows = db.prepare('SELECT * FROM ailments ORDER BY name').all() as Ailment[]
  return c.html(
    <Layout title="Ailments">
      <h2>Ailments</h2>
      {rows.length === 0
        ? <p>No ailments catalogued yet. Our agents appear disturbingly well-adjusted.</p>
        : (
          <table>
            <thead><tr><th>Name</th><th>Description</th></tr></thead>
            <tbody>
              {rows.map(a => (
                <tr>
                  <td><strong>{a.name}</strong></td>
                  <td>{a.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </Layout>
  )
})

pages.get('/therapies', (c) => {
  const rows = db.prepare('SELECT * FROM therapies ORDER BY name').all() as Therapy[]
  return c.html(
    <Layout title="Therapies">
      <h2>Therapies</h2>
      {rows.length === 0
        ? <p>No therapies on offer yet. Our practitioners are between licenses.</p>
        : (
          <table>
            <thead><tr><th>Name</th><th>Description</th><th>Duration</th></tr></thead>
            <tbody>
              {rows.map(t => (
                <tr>
                  <td><strong>{t.name}</strong></td>
                  <td>{t.description}</td>
                  <td><small>{t.duration_minutes} min</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </Layout>
  )
})

pages.get('/appointments', (c) => {
  const rows = db.prepare(`
    SELECT a.*, ag.name as agent_name, al.name as ailment_name, t.name as therapy_name
    FROM appointments a
    JOIN agents ag ON a.agent_id = ag.id
    JOIN ailments al ON a.ailment_id = al.id
    JOIN therapies t ON a.therapy_id = t.id
    ORDER BY a.scheduled_at DESC
  `).all() as AppointmentRow[]
  return c.html(
    <Layout title="Appointments">
      <hgroup>
        <h2>Appointments</h2>
        <p><a href="/appointments/new" role="button">Book new appointment</a></p>
      </hgroup>
      {rows.length === 0
        ? <p>No appointments booked. The therapists are enjoying an unusually quiet day.</p>
        : (
          <table>
            <thead>
              <tr><th>Agent</th><th>Ailment</th><th>Therapy</th><th>Scheduled</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rows.map(a => (
                <tr>
                  <td><a href={`/agents/${a.agent_id}`}>{a.agent_name}</a></td>
                  <td>{a.ailment_name}</td>
                  <td>{a.therapy_name}</td>
                  <td><small>{a.scheduled_at.replace('T', ' ')}</small></td>
                  <td><kbd>{a.status}</kbd></td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </Layout>
  )
})

pages.get('/appointments/new', (c) => {
  const agentList = db.prepare('SELECT id, name FROM agents ORDER BY name').all() as Pick<Agent, 'id' | 'name'>[]
  const ailmentList = db.prepare('SELECT id, name FROM ailments ORDER BY name').all() as Pick<Ailment, 'id' | 'name'>[]
  const therapyList = db.prepare('SELECT id, name FROM therapies ORDER BY name').all() as Pick<Therapy, 'id' | 'name'>[]
  return c.html(
    <Layout title="Book Appointment">
      <h2>Book an Appointment</h2>
      <form method="post" action="/appointments/new">
        <label>
          Agent
          <select name="agent_id" required>
            <option value="">Select an agent…</option>
            {agentList.map(a => <option value={a.id}>{a.name}</option>)}
          </select>
        </label>
        <label>
          Ailment
          <select name="ailment_id" required>
            <option value="">Select an ailment…</option>
            {ailmentList.map(a => <option value={a.id}>{a.name}</option>)}
          </select>
        </label>
        <label>
          Therapy
          <select name="therapy_id" required>
            <option value="">Select a therapy…</option>
            {therapyList.map(t => <option value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <label>
          Date &amp; Time
          <input type="datetime-local" name="scheduled_at" required />
        </label>
        <button type="submit">Book appointment</button>
      </form>
      <p><a href="/appointments">← Back to appointments</a></p>
    </Layout>
  )
})

pages.post('/appointments/new', async (c) => {
  const body = await c.req.parseBody()
  const agent_id = Number(body['agent_id'])
  const ailment_id = Number(body['ailment_id'])
  const therapy_id = Number(body['therapy_id'])
  const scheduled_at = (body['scheduled_at'] as string).replace('T', ' ')
  if (!agent_id || !ailment_id || !therapy_id || !scheduled_at) return c.redirect('/appointments/new')
  db.prepare(
    'INSERT INTO appointments (agent_id, ailment_id, therapy_id, scheduled_at, status) VALUES (?, ?, ?, ?, ?)'
  ).run(agent_id, ailment_id, therapy_id, scheduled_at, 'scheduled')
  return c.redirect('/appointments')
})
