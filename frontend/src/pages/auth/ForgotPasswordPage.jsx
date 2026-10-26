import { useState } from 'react'
import { Link } from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')

  function validateEmail(value) {
    const trimmedEmail = value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!trimmedEmail) {
      return 'O campo de e-mail é obrigatório.'
    }

    if (!emailRegex.test(trimmedEmail)) {
      return 'Por favor, insira um endereço de e-mail válido.'
    }

    return ''
  }

  const emailError = emailTouched || submitted ? validateEmail(email) : ''

  function handleEmailChange(value) {
    setEmail(value)
    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setMessage('')

    if (validateEmail(email)) {
      return
    }

    setMessage('Se o e-mail estiver registrado, você receberá instruções para redefinir sua senha.')
  }

  return (
    <AuthLayout>
      <AuthForm
        eyebrow="RECUPERAR SENHA"
        title="Esqueceu sua senha?"
        description="Informe seu e-mail para receber as instruções."
        fields={[
          {
            id: 'recovery-email',
            name: 'email',
            label: 'E-mail',
            type: 'email',
            autoComplete: 'email',
            placeholder: 'usuario@edu.unifor.br',
            value: email,
            required: true,
            error: emailError,
            onChange: handleEmailChange,
            onBlur: () => setEmailTouched(true),
          },
        ]}
        submitLabel="Enviar"
        canSubmit
        onSubmit={handleSubmit}
        message={message}
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