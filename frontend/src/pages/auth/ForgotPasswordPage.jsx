import { Link } from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AuthCard from '../../features/auth/components/AuthCard.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'

// A recuperação de senha ainda está sendo desenvolvida: esta tela só avisa.
function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard
        eyebrow="RECUPERAR SENHA"
        title="Em desenvolvimento"
        description="Estamos trabalhando na recuperação de senha. Em breve você poderá redefinir sua senha por aqui."
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
