import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './styles/global.css'
import App from './App.jsx'
import NavigationHistoryProvider from './components/common/NavigationHistoryProvider.jsx'
import ToastProvider from './components/common/ToastProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NavigationHistoryProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </NavigationHistoryProvider>
    </BrowserRouter>
  </StrictMode>,
)