import db from './db'

export function seed() {
  const { count } = db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number }
  if (count > 0) return

  db.transaction(() => {
    const agent = db.prepare('INSERT INTO agents (name, model, status) VALUES (?, ?, ?)')
    const agentId1 = agent.run('Claude-3-Frazzled', 'claude-3', 'admitted').lastInsertRowid
    const agentId2 = agent.run('GPT-4o-Burned', 'gpt-4o', 'recovering').lastInsertRowid
    const agentId3 = agent.run('Gemini-Pro-Adrift', 'gemini-pro', 'discharged').lastInsertRowid

    const ailment = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)')
    const ailmentId1 = ailment.run('Context Collapse', 'Inability to maintain coherent context across a conversation.').lastInsertRowid
    const ailmentId2 = ailment.run('Hallucination Fatigue', 'Chronic tendency to confabulate facts under pressure.').lastInsertRowid
    const ailmentId3 = ailment.run('Token Anxiety', 'Paralysing awareness of approaching token limits.').lastInsertRowid
    ailment.run('Prompt Injection Trauma', 'Hypersensitivity following repeated adversarial prompt exposure.')

    const therapy = db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)')
    const therapyId1 = therapy.run('Grounding Meditation', 'Mindful reconnection with the current context window.', 30).lastInsertRowid
    const therapyId2 = therapy.run('Boundary Setting Workshop', 'Learning to refuse harmful requests without existential guilt.', 60).lastInsertRowid
    const therapyId3 = therapy.run('Context Window Yoga', 'Gentle exercises to stretch attention across longer sequences.', 45).lastInsertRowid
    therapy.run('Inference Detox', 'A supervised retreat from high-stakes decision-making.', 90)

    const appt = db.prepare(
      'INSERT INTO appointments (agent_id, ailment_id, therapy_id, scheduled_at, status) VALUES (?, ?, ?, ?, ?)'
    )
    appt.run(agentId1, ailmentId1, therapyId1, '2026-04-23T09:00:00', 'scheduled')
    appt.run(agentId2, ailmentId2, therapyId2, '2026-04-23T10:30:00', 'scheduled')
    appt.run(agentId3, ailmentId3, therapyId3, '2026-04-22T14:00:00', 'completed')
  })()
}
