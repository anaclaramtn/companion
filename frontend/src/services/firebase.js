// Conexão com o Firebase Authentication, que cuida de senha, verificação de
// e-mail e recuperação de senha. Os demais dados ficam na nossa API.
//
// A configuração web do Firebase é pública (vai para o navegador). A chave da
// conta de serviço é outra coisa: é secreta e fica só no backend.
import { initializeApp } from 'firebase/app'
import { initializeAuth, inMemoryPersistence } from 'firebase/auth'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let auth = null

// Inicializa só quando alguém usa o login: sem as variáveis, o resto do app
// continua abrindo e a tela mostra um erro claro.
export function getFirebaseAuth() {
  if (auth) return auth

  if (Object.values(config).some((value) => !value)) {
    const error = new Error('Firebase não configurado: confira as variáveis VITE_FIREBASE_*.')
    error.code = 'companion/firebase-not-configured'
    throw error
  }

  // Persistência em memória: o Firebase só serve para provar quem é a pessoa.
  // A sessão do app continua sendo o token da nossa API (ver AuthContext).
  auth = initializeAuth(initializeApp(config), { persistence: inMemoryPersistence })
  // E-mails e telas do Firebase em português.
  auth.languageCode = 'pt-BR'
  return auth
}
