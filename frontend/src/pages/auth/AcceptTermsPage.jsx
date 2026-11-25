import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import { useFinishSignIn } from '../../features/auth/useFinishSignIn.js'
import { useAuth } from '../../hooks/useAuth.js'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import { getAuthErrorMessage } from '../../services/apiError.js'

// Primeiro acesso: a conta no Companion só é criada depois
// do aceite dos Termos e da Política de Privacidade.
function AcceptTermsPage() {
  const { hasPendingTerms, acceptTermsAndSignIn } = useAuth()
  const finishSignIn = useFinishSignIn()
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return
    setSubmitted(true)
    setMessage('')
    if (!acceptedTerms) return

    setIsSubmitting(true)
    try {
      finishSignIn(await acceptTermsAndSignIn())
    } catch (error) {
      setMessage(getAuthErrorMessage(error, 'Não foi possível criar a conta. Tente novamente.'))
      setIsSubmitting(false)
    }
  }

  // Sem login pendente (ex.: página recarregada), é preciso entrar de novo.
  // Durante o envio o login deixa de estar pendente antes da navegação.
  if (!hasPendingTerms && !isSubmitting) {
    return <Navigate to="/login" replace />
  }

  const showError = submitted && !acceptedTerms

  return (
    <AuthLayout>
      <AuthForm
        eyebrow="QUASE LÁ"
        title="Aceite os termos."
        description="Para criar sua conta no Companion, leia e aceite o documento abaixo."
        fields={[]}
        submitLabel="Concluir cadastro"
        canSubmit
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        message={message}
        messageType="error"
        footer={
          <Link className="text-button" to="/login">
            Voltar para o login
          </Link>
        }
      >
        <div className="field-group">
          <label
            htmlFor="register-terms"
            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontWeight: 500 }}
          >
            <input
              id="register-terms"
              name="acceptedTerms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => {
                setAcceptedTerms(event.target.checked)
                setMessage('')
              }}
              aria-invalid={showError}
              aria-describedby={showError ? 'register-terms-error' : undefined}
              style={{ width: '1.1rem', height: '1.1rem', marginTop: '0.15rem', flexShrink: 0 }}
            />
            <span>
              Li e aceito os{' '}
              <Link className="text-button" to="/termos-e-privacidade" target="_blank" rel="noopener">
                Termos de Uso e a Política de Privacidade
              </Link>
              .
            </span>
          </label>
          {showError && (
            <p id="register-terms-error" className="auth-field-error" role="alert">
              É preciso aceitar os Termos e a Política de Privacidade para criar a conta.
            </p>
          )}
        </div>
      </AuthForm>
    </AuthLayout>
  )
}

export default AcceptTermsPage
