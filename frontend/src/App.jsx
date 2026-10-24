import { Navigate, Route, Routes } from 'react-router'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import SignUpPage from './pages/auth/SignUpPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/criar-conta" element={<SignUpPage />} />
      <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
    </Routes>
  )
}

export default App