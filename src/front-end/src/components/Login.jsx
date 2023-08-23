import React, { useState } from 'react'

const DEV_API_URL = 'http://localhost:4001'

const basicAuthFetch = async (username, password) => {
  try {
    const res = await fetch(`${DEV_API_URL}/login`, {
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      }
    })
    console.log(res)
  } catch (err) {
    console.error(err)
  }
}

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const loginSubmit = (event) => {
    event.preventDefault()
    basicAuthFetch(username, password)
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
      <input type="submit" />
    </form>
  </>
}

export default Login