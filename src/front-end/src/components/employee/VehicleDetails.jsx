import React, { useContext, useEffect } from 'react'
import Card from '../styled/ProfileCard'
import { FuelLogContext } from '../../context.js'
import placeHolderImage from '../../assets/place-holder.png'

const VehicleDetails = ( {} ) => {

  const { currentVehicle } = useContext(FuelLogContext)

  let isVehicleImageReady = false

  if (currentVehicle) {
    const vehicleImage = new Image()
    vehicleImage.src = currentVehicle.vehicleImage_URL
    console.log(vehicleImage.src)
    vehicleImage.onload = async () => isVehicleImageReady = true
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
      <div>{!isVehicleImageReady && !currentVehicle ? <img src={placeHolderImage} />  : <img src={currentVehicle.vehicleImage_URL} />}</div>
    </Card>
  )
}

export default VehicleDetails