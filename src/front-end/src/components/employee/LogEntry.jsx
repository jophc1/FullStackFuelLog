import React, { useContext, useEffect, useState } from 'react'
import { FuelLogContext, EmployeeContext } from '../../context.js'
import companyIcon from '../../assets/fuel-log-logo.png'
import { Navigate } from 'react-router-dom'
import CompanyButton from '../styled/CompanyButton.jsx'
import VehicleDetails from './VehicleDetails.jsx'

const LogEntry = () => {

  const [vehicleID, setVehicleID] = useState({})
  const [fuel, setFuel] = useState(0)
  const [odometer, setOdometer] = useState(0)

  const { getAllVehicles, allVehicles, currentVehicleDetails, currentVehicle, authorised, backButton } = useContext(FuelLogContext)
  const { postLogEntry } = useContext(EmployeeContext)

  useEffect(() => {
    (async () => {
      await getAllVehicles()
    })()
  },[])

  async function selectVehicle(event) {
    await currentVehicleDetails(event.target.value)
    // setVehicleID(event.target.value)
  }
  // calling post method for log
  async function handleSubmit(event) {
    event.preventDefault()
    const postLog = {
      vehicle_id: currentVehicle._id,
      fuel_added: parseInt(fuel),
      current_odo: parseInt(odometer)
    }
    postLogEntry(postLog)
  }

  function handleLogEntryBackButton (event) {
    event.preventDefault()
    backButton('/employee/dashboard/home')
  }

  return authorised ? <>
      <img src={companyIcon} />
      <div><h3>New Log Entry</h3></div>
      <label>Select Vehicle:</label>
      <select onChange={selectVehicle} defaultValue={'default'}>
        <option value='default' disabled>No car selected</option>
        {allVehicles && allVehicles.map(vehicle => <option key={vehicle.asset_id} value={vehicle.asset_id}>{vehicle.asset_id}</option>)}
      </select>
      <VehicleDetails />
      
      <form onSubmit={handleSubmit}>
        <label>Current ODO:</label>
          <input onChange={evt => setOdometer(evt.target.value)}></input>
        <label>Added Fuel:</label>
          <input onChange={evt => setFuel(evt.target.value)}></input>
        <div className='logEntryButtons'>
          <CompanyButton onClick={handleLogEntryBackButton}>Back</CompanyButton>
          <CompanyButton>Submit log</CompanyButton>
        </div>
        
      </form>
      

    </> : <Navigate to='/' />
    
  
}

export default LogEntry