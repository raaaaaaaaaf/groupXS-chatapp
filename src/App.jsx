import { useContext, useRef, useState, useEffect } from 'react'
import {Auth} from './components/Auth'
import {SignUp} from './components/SignUp'
import {Chat} from './components/Chat'
import Room from './components/Room'
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

function App() {
  const { currentUser } = useContext(AuthContext);
  const [room, setRoom] = useState("");

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children
  };

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/'/>
          <Route index element={<ProtectedRoute><Room room={room} setRoom={setRoom}/></ProtectedRoute>}/>
          <Route path='signup' element={<SignUp/>}/>
          <Route path='login' element={<Auth/>}/>
          <Route path='chat' element={<ProtectedRoute><Chat room={room}/></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
  )      
}

export default App
