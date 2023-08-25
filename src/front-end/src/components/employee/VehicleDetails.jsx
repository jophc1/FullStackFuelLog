import React, { useContext } from 'react'
import Card from '../styled/ProfileCard'
import { FuelLogContext } from '../../context'

const VehicleDetails = () => {

  const { currentVehicle } = useContext(FuelLogContext)

  let isVehicleImageReady = false

  if (currentVehicle) {
    const vehicleImage = new Image()
    vehicleImage.src = currentVehicle.vehicleImage_URL
    vehicleImage.onload = () => isVehicleImageReady = true
  }
  
  return (
    <Card>
      <div>
        <table>
          <thead>
            <tr>
              <th><h3>Current monthly report</h3></th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td>Fuel Total:</td>
            <td></td>
          </tr>
          <tr>
            <td>Vehicles Used:</td>
            <td></td>
          </tr>
          <tr>
            <td>Log Entries:</td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div>{isVehicleImageReady && currentVehicle ? <><p>Work bitch</p></>  : <img src={currentVehicle.vehicleImage_URL} />}</div>
    </Card>
  )
}

export default VehicleDetails