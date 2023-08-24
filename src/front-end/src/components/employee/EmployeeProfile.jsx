import React, { useContext } from 'react'
import FuelLogContext from '../../context.js'
import Card from '../styled/ProfileCard'
import EmployeeReport from './EmployeeReport'

const EmployeeProfile = () => {
  const { userName } = useContext(FuelLogContext)
  const firstUserInitial = userName.substring(0,1)
  const secondUserInital = userName.substring(userName.indexOf(' ') + 1, userName.indexOf(' ') + 2)
  return (
    <Card>
      <div className='profileIcon'>{firstUserInitial + secondUserInital}</div>
      <h2>{userName}</h2>
      <EmployeeReport />
    </Card>
  )
}

export default EmployeeProfile