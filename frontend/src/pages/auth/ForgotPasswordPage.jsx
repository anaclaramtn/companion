import { useState } from 'react'
import { Link } from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import { getAuthErrorMessage } from '../../services/apiError.js'
import { sendPasswordReset } from '../../services/authService.js'

// O Firebase envia o e-mail e mostra a tela em que a pessoa cria a nova senha.
function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ message: '', type: 'status' })

  async function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim() || isSubmitting) return

    setFeedback({ message: '', type: 'status' })
    setIsSubmitting(true)
    try {
      await sendPasswordReset(email.trim())
      setFeedback({
        message:
          'Se houver uma conta com esse e-mail, você receberá um link para criar uma nova senha. Confira também o spam.',
        type: 'status',
      })
    } catch (error) {
      setFeedback({
        message: getAuthErrorMessage(error, 'Não foi possível enviar o e-mail. Tente novamente.'),
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <AuthForm
        eyebrow="RECUPERAR SENHA"
        title="Esqueceu a senha?"
        description="Informe seu e-mail institucional para receber o link de redefinição."
        fields={[
          {
            id: 'forgot-email',
            name: 'email',
            label: 'E-mail',
            type: 'email',
            autoComplete: 'email',
            placeholder: 'usuario@edu.unifor.br',
            value: email,
            onChange: (value) => {
              setEmail(value)
              setFeedback({ message: '', type: 'status' })
            },
            trailing: <i className="bi bi-envelope" aria-hidden="true" />,
          },
        ]}
        submitLabel="Enviar link"
        canSubmit={email.trim().length > 0}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        message={feedback.message}
        messageType={feedback.type}
        footer={
          <Link to="/login" className="text-button">
            Voltar para o login
          </Link>
        }
      />
    </AuthLayout>
  )
}

export default ForgotPasswordPage
