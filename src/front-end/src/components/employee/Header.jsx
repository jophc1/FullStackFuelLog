import React from 'react'
import logo from '../../assets/fuel-log-logo.png'

const Header = ({ children }) => {
  return <header>
    <img src={logo} alt="company logo" id='logo' />
    {children}
  </header>
  
}

export default Header