// src/App.jsx
import AppRouter from './routes/AppRouter'
import ErrorToastStack from './components/ErrorToastStack'


function App() {
  return (
    <>
      <ErrorToastStack />
      <AppRouter />
    </>
  )
}

export default App