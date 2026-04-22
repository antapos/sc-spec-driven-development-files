export function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><strong><a href="/">AgentClinic</a></strong></li>
        </ul>
        <ul>
          <li><a href="/agents">Agents</a></li>
          <li><a href="/ailments">Ailments</a></li>
          <li><a href="/therapies">Therapies</a></li>
          <li><a href="/appointments">Appointments</a></li>
          <li><a href="/appointments/new" role="button">Book</a></li>
        </ul>
      </nav>
    </header>
  )
}
