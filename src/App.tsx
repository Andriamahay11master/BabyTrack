import './App.scss'
import './assets/scss/main.scss'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './page/dashboard/Dashboard'
import AddArticle from './page/addArticle/AddArticle'
import ListArticle from './page/listArticle/ListArticle'
import Statistics from './page/statistics/Statistics'
import Login from './page/login/Login'
import SignUp from './page/signup/SignUp'
import SignIn from './page/signIn/SignIn'
import ForgotPassword from './page/forgotPassword/ForgotPassword'
import Splashscreen from './page/splashscreen/Splashscreen'
import { useEffect, useState } from 'react'

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Simulate a 3-second load time
    return () => clearTimeout(timer);
  }, [])

  if (loading) {
    return <Splashscreen />
  }

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/addArticle" element={<AddArticle />}></Route>
        <Route path="/listArticle" element={<ListArticle />}></Route>
        <Route path="/statistics" element={<Statistics />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
        <Route path="/" element={<Dashboard />}></Route>
      </Routes>
    </Router>
  )
}

export default App
