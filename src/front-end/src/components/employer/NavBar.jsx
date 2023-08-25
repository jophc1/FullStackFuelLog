import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import fuelLogo from '../../assets/fuel-log-logo.png'
import { FuelLogContext } from '../../context.js'

const NavBar = () => {
  const { userLogout } = useContext(FuelLogContext)

  const handleLogoutClick = event => {
    event.preventDefault()
    userLogout()
  }

  return <>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to='/'><img src={fuelLogo} alt="fuel logo" id='navLogo' /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" href="#">HOME</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" >VEHICLES</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" href="#">EMPLOYEES</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" href="#">LOGS</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" href="#">REVIEWS</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" onClick={handleLogoutClick}>LOGOUT</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </>
}

export default NavBar