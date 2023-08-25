import React from 'react'
import logo from '../../assets/fuel-log-logo.png'

const Header = ({ children }) => {

  const fuelLogo = new Image()
  fuelLogo.src = logo

  let isImgReady = false
  fuelLogo.onload = () => isImgReady = true

  return <header>
    {isImgReady ? <></> : <img src={logo} alt="company logo" id='logo' />}
    {children}
  </header>
  
}

export default Header