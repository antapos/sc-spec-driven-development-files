import db from './db'

export function seed() {
  const { count } = db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number }
  if (count > 0) return

  const agent = db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)')
  agent.run('Claude-3-Frazzled', 'claude-3', 'admitted')
  agent.run('GPT-4o-Burned', 'gpt-4o', 'recovering')
  agent.run('Gemini-Pro-Adrift', 'gemini-pro', 'discharged')

  const ailment = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)')
  ailment.run('Context Collapse', 'Inability to maintain coherent context across a conversation.')
  ailment.run('Hallucination Fatigue', 'Chronic tendency to confabulate facts under pressure.')
  ailment.run('Token Anxiety', 'Paralysing awareness of approaching token limits.')
  ailment.run('Prompt Injection Trauma', 'Hypersensitivity following repeated adversarial prompt exposure.')

  const therapy = db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)')
  therapy.run('Grounding Meditation', 'Mindful reconnection with the current context window.', 30)
  therapy.run('Boundary Setting Workshop', 'Learning to refuse harmful requests without existential guilt.', 60)
  therapy.run('Context Window Yoga', 'Gentle exercises to stretch attention across longer sequences.', 45)
  therapy.run('Inference Detox', 'A supervised retreat from high-stakes decision-making.', 90)

  const appt = db.prepare(
    'INSERT INTO appointments (agent_id, ailment_id, therapy_id, scheduled_at, status) VALUES (?, ?, ?, ?, ?)'
  )
  appt.run(1, 1, 1, '2026-04-23T09:00:00', 'scheduled')
  appt.run(2, 2, 2, '2026-04-23T10:30:00', 'scheduled')
  appt.run(3, 3, 3, '2026-04-22T14:00:00', 'completed')
}
