import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
// import Lobby from './screens/Lobby'
import Room from './screens/Room'
import SignUp from './screens/SignUp'
import Login from './screens/Login'
import Home from './screens/Home'
import { useAuth } from './contexts/AuthProvider'

const App = () => {

  const { authToken } = useAuth();

  return (
    <div>
      <Routes>
        {/* <Route path='/' element={<Lobby />} /> */}
        <Route path='/room/:roomId' element={<Room />} />

        <Route
        path="/signup"
        element={!authToken ? <SignUp /> : <Navigate to="/" />}
        />

        <Route
          path="/login"
          element={!authToken ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/"
          element={authToken ? <Home /> : <Navigate to="/login" />}
        />

      </Routes>
    </div>
  )
}

export default App