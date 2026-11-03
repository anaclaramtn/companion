import { Link } from 'react-router'

function BackLink({ to, label }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm font-semibold text-companion-muted transition-colors hover:text-companion-text"
    >
      <i className="bi bi-arrow-left" aria-hidden="true" />
      {label}
    </Link>
  )
}

export default BackLink
