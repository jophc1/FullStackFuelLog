import React, { useState, useContext } from 'react'
import { FuelLogContext } from '../context.js'
import companyIcon from '../assets/fuel-log-logo.png'
import Card from './styled/ProfileCard.jsx'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { loginAccess } = useContext(FuelLogContext)

  const loginSubmit = (event) => {
    event.preventDefault()
    loginAccess(username, password)
  }

  return <>
    <img src={companyIcon} />
    <h3>Company Fuel Log</h3>
    <Card>
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
        <input type="submit" value='Login' />
      </form>
    </Card>
    <footer>&copy; Freight Forwarding Service Trucking 2023</footer>
  </>
}

export default Login