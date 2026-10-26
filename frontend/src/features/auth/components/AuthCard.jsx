import './AuthCard.css'

function AuthCard({ eyebrow, title, description, children, footer, message }) {
  return (
    <section className="auth-card" aria-labelledby="auth-card-title">
      <div className="auth-heading">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 id="auth-card-title">{title}</h1>
        {description && <p>{description}</p>}
      </div>

      {children}
      {footer && <div className="auth-card-footer">{footer}</div>}
      {message && <p className="preview-notice" role="status">{message}</p>}
    </section>
  )
}

export default AuthCard
