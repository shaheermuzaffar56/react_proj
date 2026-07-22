// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ErrorToastProvider } from './context/ErrorToastContext.jsx'
import { QueryProvider } from './lib/QueryProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorToastProvider>
        <QueryProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryProvider>
      </ErrorToastProvider>
    </BrowserRouter>
  </StrictMode>,
)