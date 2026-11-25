import {
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import api from '../api/api.js'
import { getFirebaseAuth } from './firebase.js'

function authError(code) {
  const error = new Error(code)
  error.code = code
  return error
}

// Devolve o ID token do Firebase, que depois é trocado pelo token da nossa API
// (exchangeFirebaseToken).
export async function signInWithEmail(email, password) {
  const { user } = await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
  // A pessoa continua conectada ao Firebase (em memória) para poder pedir o
  // reenvio do link de verificação.
  if (!user.emailVerified) throw authError('companion/email-not-verified')
  return user.getIdToken()
}

// Cria a conta no Firebase e envia o link de verificação. A conta no Companion
// só é criada no primeiro login, depois que o e-mail for confirmado.
export async function createEmailAccount(email, password) {
  const { user } = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
  try {
    await sendEmailVerification(user)
    return { emailSent: true }
  } catch {
    // A conta já existe: a próxima tela oferece o reenvio.
    return { emailSent: false }
  }
}

function pendingUser() {
  const user = getFirebaseAuth().currentUser
  if (!user) throw authError('companion/no-pending-user')
  return user
}

export async function resendConfirmationEmail() {
  await sendEmailVerification(pendingUser())
}

// Depois que a pessoa abre o link, busca o estado atualizado e gera um token
// novo (o antigo ainda diz que o e-mail não foi verificado).
export async function getVerifiedIdToken() {
  const user = pendingUser()
  await reload(user)
  if (!user.emailVerified) throw authError('companion/email-not-verified')
  return user.getIdToken(true)
}

export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(getFirebaseAuth(), email)
  } catch (error) {
    // Não revela se existe conta com o e-mail informado.
    if (error.code !== 'auth/user-not-found') throw error
  }
}

export async function signOutFirebase() {
  await signOut(getFirebaseAuth())
}

// acceptedTerms só é necessário no primeiro acesso: sem ele a API responde 428.
export async function exchangeFirebaseToken(idToken, acceptedTerms) {
  const response = await api.post('/auth/firebase', { idToken, acceptedTerms })
  return response.data
}
