import './App.scss'
import './assets/scss/main.scss'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './page/dashboard/Dashboard'
import AddArticle from './page/addArticle/AddArticle'
import ListArticle from './page/listArticle/ListArticle'
import Statistics from './page/statistics/Statistics'
import Login from './page/login/Login'
import SignUp from './page/signup/SignUp'
import ForgotPassword from './page/forgotPassword/ForgotPassword'
import Splashscreen from './page/splashscreen/Splashscreen'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './firebase'
import { ProtectedRoute } from './ProtectedRoute'

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
            setIsFetching(false);
            return; 
        }
        setUser(null);
        setIsFetching(false);
    })
    return () => unsubscribe();
})

  if (isFetching) {
    return <Splashscreen />
  }

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>}></Route>
        <Route path="/addArticle" element={<ProtectedRoute user={user}><AddArticle state={true}/></ProtectedRoute>}></Route>
        <Route path="/setArticle/:id" element={<ProtectedRoute user={user}><AddArticle state={false} /></ProtectedRoute>}></Route>
        <Route path="/listArticle" element={<ProtectedRoute user={user}><ListArticle /></ProtectedRoute>}></Route>
        <Route path="/statistics" element={<Statistics />}></Route>
        <Route path="/login" element={<Login user={user}/>}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
        <Route path="/" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>}></Route>
      </Routes>
    </Router>
  )
}

export default App
