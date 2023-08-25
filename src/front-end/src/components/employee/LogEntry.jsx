import React, { useContext, useEffect, useState } from 'react'
import { FuelLogContext, EmployeeContext } from '../../context.js'

import CompanyButton from '../styled/CompanyButton.jsx'

const LogEntry = ({ children }) => {

  // const [vehicleID, setVehicleID] = useState({})
  let vehicleID
  const [fuel, setFuel] = useState(0)
  const [odometer, setOdometer] = useState(0)

  const { getAllVehicles, allVehicles, currentVehicleDetails, currentVehicle } = useContext(FuelLogContext)
  const { postLogEntry } = useContext(EmployeeContext)

  useEffect(() => {
    (async () => {
      await getAllVehicles()
    })()
  },[])

  function selectVehicle(event) {
    vehicleID = event.target.value
    currentVehicleDetails(allVehicles.find(vehicle => vehicle._id === vehicleID))
    console.log(allVehicles.find(vehicle => vehicle._id === vehicleID))
    console.log(allVehicles)
  }
  // calling post method for log
  async function handleSubmit(event) {
    event.preventDefault()
    const postLog = {
      vehicle_id: vehicleID.toString(),
      fuel_added: parseInt(fuel),
      current_odo: parseInt(odometer)
    }
    postLogEntry(postLog)
  }

  return <>
      <div>LogEntry</div>
      <select onChange={selectVehicle}>
        <option value={vehicleID}>No car selected</option>
        {allVehicles && allVehicles.map(vehicle => <option key={vehicle.asset_id} value={vehicle._id}>{vehicle.asset_id}</option>)}
      </select>
      {children}
      {vehicleID && 
      <form onSubmit={handleSubmit}>
        <label>Current ODO:</label>
          <input onChange={evt => setOdometer(evt.target.value)}></input>
        <label>Added Fuel:</label>
          <input onChange={evt => setFuel(evt.target.value)}></input>
        <CompanyButton >Submit log</CompanyButton>
      </form>
      }

    </>
    
  
}

export default LogEntry