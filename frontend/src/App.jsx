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
    </Routes>
  )
}

export default App
