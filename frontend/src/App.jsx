import { Navigate, Route, Routes } from 'react-router'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import SignUpPage from './pages/auth/SignUpPage.jsx'
import FeedLayout from './layouts/user/FeedLayout.jsx'
import PostDetailLayout from './layouts/user/PostDetailLayout.jsx'
import FeedPage from './pages/feed/FeedPage.jsx'
import ExplorePage from './pages/search/ExplorePage.jsx'
import PublicProfilePage from './pages/profile/PublicProfilePage.jsx'
import PostDetailPage from './pages/posts/PostDetailPage.jsx'
import SettingsPage from './pages/settings/SettingsPage.jsx'
import AccountInfoPage from './pages/settings/AccountInfoPage.jsx'
import AccountSettingsPage from './pages/settings/AccountSettingsPage.jsx'
import FaqPage from './pages/faq/FaqPage.jsx'
import AboutPage from './pages/about/AboutPage.jsx'
import SupportPage from './pages/support/SupportPage.jsx'
import TermsPage from './pages/terms/TermsPage.jsx'
import MyProfilePage from './pages/profile/MyProfilePage.jsx'
import EditProfilePage from './pages/profile/EditProfilePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/criar-conta" element={<SignUpPage />} />
      <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />

      <Route path="/feed" element={<FeedLayout />}>
        <Route index element={<FeedPage />} />
        <Route path="users/:userId" element={<PublicProfilePage />} />
        <Route path="posts/:postId" element={<PostDetailLayout />}>
          <Route index element={<PostDetailPage />} />
        </Route>
      </Route>

      <Route path="/explorar" element={<FeedLayout />}>
        <Route index element={<ExplorePage />} />
      </Route>

      <Route path="/configuracoes" element={<FeedLayout />}>
        <Route index element={<SettingsPage />} />
        <Route path="conta" element={<AccountInfoPage />} />
        <Route path="ajustes" element={<AccountSettingsPage />} />
      </Route>

      <Route path="/faq" element={<FeedLayout />}>
        <Route index element={<FaqPage />} />
      </Route>

      <Route path="/sobre" element={<FeedLayout />}>
        <Route index element={<AboutPage />} />
      </Route>

      <Route path="/ajuda" element={<FeedLayout />}>
        <Route index element={<SupportPage />} />
      </Route>

      <Route path="/termos" element={<FeedLayout />}>
        <Route index element={<TermsPage />} />
      </Route>

      <Route path="/perfil" element={<FeedLayout />}>
        <Route index element={<MyProfilePage />} />
        <Route path="editar" element={<EditProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
