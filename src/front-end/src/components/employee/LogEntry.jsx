import React, { useContext, useEffect, useState } from 'react'
import { FuelLogContext, EmployeeContext } from '../../context.js'
import fetchMod from '../../fetch/fetch.js'
import CompanyButton from '../styled/CompanyButton.jsx'

const LogEntry = () => {

  const [vehicleID, setVehicleID] = useState({})
  const [fuel, setFuel] = useState(0)
  const [odometer, setOdometer] = useState(0)

  const { getAllVehicles, allVehicles } = useContext(FuelLogContext)
  const { postLogEntry } = useContext(EmployeeContext)

  useEffect(() => {
    (async () => {
      await getAllVehicles()
    })()
  },[])

  function selectVehicle(event) {
    setVehicleID(event.target.value)
    // get data from form
    
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