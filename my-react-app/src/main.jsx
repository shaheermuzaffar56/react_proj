// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
// import './index.css'
import App from './App.jsx'
import theme from './theme.js'
import { AuthProvider } from './context/AuthContext.jsx'
import { ErrorToastProvider } from './context/ErrorToastContext.jsx'
import { QueryProvider } from './lib/QueryProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ErrorToastProvider>
          <QueryProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </QueryProvider>
        </ErrorToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)