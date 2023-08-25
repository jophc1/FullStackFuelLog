import React, { useContext, useEffect, useState } from 'react'
import { FuelLogContext, EmployeeContext } from '../../context.js'

import CompanyButton from '../styled/CompanyButton.jsx'
import VehicleDetails from './VehicleDetails.jsx'

const LogEntry = ({ children }) => {

  const [vehicleID, setVehicleID] = useState({})
  const [fuel, setFuel] = useState(0)
  const [odometer, setOdometer] = useState(0)

  const { getAllVehicles, allVehicles, currentVehicleDetails, currentVehicle } = useContext(FuelLogContext)
  const { postLogEntry } = useContext(EmployeeContext)

  useEffect(() => {
    (async () => {
      await getAllVehicles()
    })()
  },[])

  async function selectVehicle(event) {
    // setVehicleID(event.target.value)
    // const vehicleData = allVehicles.find(vehicle => vehicle._id === vehicleID)
    console.log(event)
    await currentVehicleDetails(event.target.value)
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
      <select onChange={selectVehicle} defaultValue={'default'}>
        <option value='default' disabled>No car selected</option>
        {allVehicles && allVehicles.map(vehicle => <option key={vehicle.asset_id} value={vehicle.asset_id}>{vehicle.asset_id}</option>)}
      </select>
      <VehicleDetails />
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