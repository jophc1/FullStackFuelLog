import React, { useState, useContext } from 'react'
import { FuelLogContext } from '../context.js'
import companyIcon from '../assets/fuel-log-logo.png'
import Card from './styled/ProfileCard.jsx'
import ModalText from './ModalText.jsx'

const Login = () => {
  /* CONTEXTS */ 
  const { loginAccess,
          errorMessage,
          modalErrorRender,
          setModalErrorRender,
          renderLoadingGif,
          setRenderLoadingGif,
          loaderGif } = useContext(FuelLogContext)
  /* ====================== */
  /* STATES */
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  /* ====================== */
  /* EVENT HANDLER FUNCTIONS */ 
  const loginSubmit = (event) => {
    event.preventDefault()
    setRenderLoadingGif(!renderLoadingGif)
    // pass form data to loginAcces function
    loginAccess(username, password)
  }
  /* ====================== */
  /* IMAGE LOADING */
  let isLogoImageReady = false
  const logo = new Image()
  logo.src = companyIcon
  logo.onload = () => isLogoImageReady = true
  /* ====================== */

  return <>
    <div className='loginPage'>
      {isLogoImageReady ? <></> : <img src={companyIcon} />}
      <h3>Company Fuel Log</h3>
      <Card id='loginCard'>
        <form role='form' onSubmit={loginSubmit}>
          <label htmlFor='username' >Username:</label>
          <input
            id='username'
            type="text"
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
          <label htmlFor='password'>Password:</label>
          <input
            id='password'
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <input id='loginButton' type="submit" value='LOGIN' />
          { renderLoadingGif && <img id='loading' src={loaderGif} alt="loading gif" />}
        </form>
      </Card>
      <footer>&copy; Freight Forwarding Service Trucking 2023</footer>
    </div>
    { modalErrorRender &&
      <ModalText setRenderModal={setModalErrorRender} style={'error'}>
          <div>
          { errorMessage }
          </div>
      </ModalText>
    }
  </>
}

export default Login