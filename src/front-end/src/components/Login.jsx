import React, { useState, useContext } from 'react'
import { FuelLogContext } from '../context.js'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { loginAccess } = useContext(FuelLogContext)

  const loginSubmit = (event) => {
    event.preventDefault()
    loginAccess(username, password)
  }

  return <>
    <form onSubmit={loginSubmit}>
      <label>Username:</label>
      <input
        type="text"
        value={username}
        onChange={event => setUsername(event.target.value)}
      />
      <label>Password:</label>
      <input
        type="text"
        value={password}
        onChange={event => setPassword(event.target.value)}
      />
      <input type="submit" value='Submit' />
    </form>
  </>
}

export default Login