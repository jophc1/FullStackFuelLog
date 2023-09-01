import React, { useContext, useEffect, useState } from 'react'
import { FuelLogContext } from '../../context.js'
import companyIcon from '../../assets/fuel-log-logo.png'
import { Navigate } from 'react-router-dom'
import CompanyButton from '../styled/CompanyButton.jsx'
import VehicleDetails from './VehicleDetails.jsx'
import placeHolderImage from '../../assets/no-image.png'

const LogEntry = () => {

  const [fuel, setFuel] = useState(0)
  const [odometer, setOdometer] = useState(0)

  const emptyVehicleProfile = { make: '', model: '', year: '', asset_id: '', registration: '', vehicleImage_URL: placeHolderImage }

  const { postLogEntry,
          allVehicles,
          currentVehicleDetails,
          currentVehicle,
          authorised,
          backButton,
          displayVehicleInfo,
          displayPlaceholderVehicleInfo,
          setComponentMount,
          newLogCreated } = useContext(FuelLogContext)

  let isVehicleImageReady = false
  let isPlaceHolderImageReady = false
  let isCompanyIconReady = false

  const loadLogo = new Image()
  loadLogo.src = companyIcon
  loadLogo.onload = () => isCompanyIconReady = true
  
  const loadImg = new Image()
  loadImg.src = placeHolderImage
  loadImg.onload = () => isPlaceHolderImageReady = true

  if (currentVehicle.vehicleImage_URL) {
    const vehicleImage = new Image()
    vehicleImage.src = currentVehicle.vehicleImage_URL
    vehicleImage.onload = () => isVehicleImageReady = true
  }

  function selectVehicle(event) {
    currentVehicleDetails(event.target.value)
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

  return authorised ? <div className='logEntryComponent'>
      <div className='logEntryTitleLogo'>
        {isCompanyIconReady ? <></> : <img src={companyIcon} /> }
        <h3>New Log Entry</h3>
      </div>
      <div className='selectVehicleDropmenu'>
        <label>Select Vehicle:</label>
        <select onChange={selectVehicle} defaultValue={'default'}>
          <option value='default' disabled>No car selected</option>
          {allVehicles && allVehicles.map(vehicle => <option key={vehicle.asset_id} value={vehicle.asset_id}>{vehicle.asset_id}</option>)}
        </select>
      </div>
      

      {displayPlaceholderVehicleInfo && isPlaceHolderImageReady ? <></> : <VehicleDetails displayDetails={displayPlaceholderVehicleInfo} data={emptyVehicleProfile} />}
      {displayVehicleInfo && isVehicleImageReady ? <></> : isPlaceHolderImageReady ?  <VehicleDetails displayDetails={displayPlaceholderVehicleInfo} data={emptyVehicleProfile} /> : <VehicleDetails displayDetails={displayVehicleInfo} data={currentVehicle} />}
      
      <form onSubmit={handleSubmit} className='logEntryForm'>
        <div>
          <label>Current ODO (km):</label>
          <input onChange={evt => setOdometer(evt.target.value)} />
        </div>
        <div>
          <label>Added Fuel (L):</label>
          <input onChange={evt => setFuel(evt.target.value)} />
        </div>
        <div>
          <CompanyButton onClick={handleLogEntryBackButton}>Back</CompanyButton>
          <CompanyButton>Submit log</CompanyButton>
        </div>
      </form>
    
    </div> : <Navigate to='/' />
    
  
}

export default LogEntry