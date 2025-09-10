import './App.css'
import { useAuth } from './context/AuthContext'
import FormContent from './components/FormContent' 
import Dashboard from './components/Dashboard'

function App() {

  const { isLoggedIn } = useAuth();
 
  return (
    <>
      {isLoggedIn ? <Dashboard /> : <FormContent />}
    </>
  )
}

export default App
