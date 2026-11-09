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
  isSubmitting = false,
  onSubmit,
  footer,
  message,
  messageType,
  topContent, // opcional: conteúdo no topo do card (ex.: barra de progresso)
  children, // opcional: conteúdo livre entre os campos e o botão de envio
  actions, // opcional: { start, extra } para "Voltar"/"Pular" ao lado do botão de envio
}) {
  const submitButton = (
    <button className="submit-button" type="submit" disabled={!canSubmit || isSubmitting}>
      {isSubmitting ? 'Aguarde...' : submitLabel} <span aria-hidden="true" />
    </button>
  )

  return (
    <AuthCard
      eyebrow={eyebrow}
      title={title}
      description={description}
      footer={footer}
      message={message}
      messageType={messageType}
      topContent={topContent}
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {fields.map((field) => (
          <AuthField key={field.name} {...field} />
        ))}
        {children}
        {actions ? (
          <div className="auth-actions">
            <div className="auth-actions-start">{actions.start}</div>
            <div className="auth-actions-end">
              {actions.extra}
              {submitButton}
            </div>
          </div>
        ) : (
          submitButton
        )}
      </form>
    </AuthCard>
  )
}

export default AuthForm
