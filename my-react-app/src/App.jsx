// src/App.jsx
import AppRouter from './routes/AppRouter'
import ErrorToastStack from './components/ErrorToastStack'
import './App.css'

function App() {
  return (
    <>
      <ErrorToastStack />
      <AppRouter />
    </>
  )
}

export default App