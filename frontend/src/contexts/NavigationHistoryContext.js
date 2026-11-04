import { createContext } from 'react'

// Lista dos caminhos abertos na sessão, do mais antigo ao atual.
// Fornecida por NavigationHistoryProvider; use pelo hook useBackTarget.
export const NavigationHistoryContext = createContext([])
