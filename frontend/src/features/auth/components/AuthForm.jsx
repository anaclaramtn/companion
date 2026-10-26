import AuthCard from './AuthCard.jsx'
import AuthField from './AuthField.jsx'
import './AuthForm.css'

function AuthForm({
  eyebrow,
  title,
  description,
  fields,
  submitLabel,
  canSubmit,
  onSubmit,
  footer,
  message,
}) {
  return (
    <AuthCard
      eyebrow={eyebrow}
      title={title}
      description={description}
      footer={footer}
      message={message}
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {fields.map((field) => (
          <AuthField key={field.name} {...field} />
        ))}
        <button className="submit-button" type="submit" disabled={!canSubmit}>
          {submitLabel} <span aria-hidden="true" />
        </button>
      </form>
    </AuthCard>
  )
}

export default AuthForm
