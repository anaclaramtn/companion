import {useState} from 'react'
import {Link} from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css'

const menuItems = [
  {to: '/feed', label: 'Feed', icon: 'bi-house', active: false},
  {to: '/explorar', label: 'Explorar', icon: 'bi-search', active: false},
  {to: '/salvos', label: 'Salvos', icon: 'bi-bookmark', active: true},
  {to: '/configuracoes', label: 'Configurações', icon: 'bi-gear', active: false},
]

const user = {
  name: 'ewdes',
  following: 0,
  followers: 0,
}

const initialPosts = [
  {
    id: 1,
    author: 'Ana Beatriz',
    username: '@anabeatriz',
    time: 'há 4min',
    title: 'Quando devo usar a terceira forma normal em um banco de dados?',
    description:
      'Estou modelando um sistema acadêmico e fiquei em dúvida sobre quando aplicar a terceira forma normal. Alguém consegue mostrar um exemplo simples?',
    tags: ['Banco de Dados', 'Modelagem'],
    likes: 9,
    comments: 0,
  },
]

function SavedPage() {
  const [posts, setPosts] = useState(initialPosts)

  const countLabel =
    posts.length === 1 ? '1 dúvida salva' : `${posts.length} dúvidas salvas`

  function handleUnsave(id) {
    // A remoção ainda precisa ser conectada à API.
    setPosts(posts.filter((post) => post.id !== id))
  }

  return (
    <div className="app-page">
      <header className="app-header">
        <Link className="app-logo" to="/feed">
          Companion
        </Link>

        <div className="app-header-actions">
          <Link className="post-button" to="/postar-duvida">
            <i className="bi bi-plus" aria-hidden="true" /> Postar dúvida
          </Link>
          <span className="avatar">
            <i className="bi bi-person" aria-hidden="true" />
          </span>
        </div>
      </header>

      <aside className="app-sidebar">
        <nav className="menu">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              className={item.active ? 'menu-item active' : 'menu-item'}
              to={item.to}
            >
              <i className={`bi ${item.icon}`} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="profile-card">
          <span className="avatar">
            <i className="bi bi-person" aria-hidden="true" />
          </span>
          <strong>{user.name}</strong>
          <div className="profile-stats">
            <span>
              <b>{user.following}</b> seguindo
            </span>
            <span>
              <b>{user.followers}</b> seguidores
            </span>
          </div>
        </div>
      </aside>

      <main className="saved-content">
        <h1>Salvos</h1>
        <p className="description">{countLabel}</p>

        {posts.length === 0 && (
          <p className="empty-message">Você ainda não salvou nenhuma dúvida.</p>
        )}

        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-author">
              <span className="avatar">
                <i className="bi bi-person" aria-hidden="true" />
              </span>
              <div>
                <strong>{post.author}</strong>
                <span>{post.username}</span>
              </div>
              <span className="post-time">{post.time}</span>
            </div>

            <h2>{post.title}</h2>
            <p>{post.description}</p>

            <div className="post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="post-actions">
              <div>
                <span>
                  <i className="bi bi-heart" aria-hidden="true" /> {post.likes}
                </span>
                <span>
                  <i className="bi bi-chat" aria-hidden="true" /> {post.comments}
                </span>
              </div>

              <div>
                <button
                  type="button"
                  className="icon-button saved"
                  aria-label="Remover dos salvos"
                  onClick={() => handleUnsave(post.id)}
                >
                  <i className="bi bi-bookmark-fill" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Denunciar dúvida"
                >
                  <i className="bi bi-flag" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  )
}

export default SavedPage
