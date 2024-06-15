import { Outlet, Route, Routes } from 'react-router-dom'
import { createContext, useState } from 'react'

export const AuthContext = createContext({
  token: null,
  setToken: () => {}
})

function App() {

  const [token, setToken] = useState()

  return (
    <AuthContext.Provider value={{token, setToken}}>
      <Outlet />
    </AuthContext.Provider>
  )
}

export default App
