import React, { useContext, useEffect } from 'react'
import Card from '../styled/ProfileCard'
import { FuelLogContext } from '../../context.js'
import placeHolderImage from '../../assets/no-image.png'

const VehicleDetails = ( {} ) => {

  const { currentVehicle } = useContext(FuelLogContext)

  let isVehicleImageReady = false

  if (currentVehicle) {
    const vehicleImage = new Image()
    vehicleImage.src = currentVehicle.vehicleImage_URL
    vehicleImage.onload = async () => isVehicleImageReady = true
  }

  return (
    <Card>
      <div>
        <table>
          <tbody>
          <tr>
            <td>Asset ID:</td>
            <td>{currentVehicle && currentVehicle.asset_id}</td>
          </tr>
          <tr>
            <td>Reg No:</td>
            <td>{currentVehicle && currentVehicle.registration}</td>
          </tr>
          <tr>
            <td>Make:</td>
            <td>{currentVehicle && currentVehicle.make}</td>
          </tr>
          <tr>
            <td>Model:</td>
            <td>{currentVehicle && currentVehicle.model}</td>
          </tr>
          <tr>
            <td>Year:</td>
            <td>{currentVehicle && currentVehicle.year}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div>{!isVehicleImageReady && !currentVehicle ? <img src={placeHolderImage} />  : <img src={currentVehicle.vehicleImage_URL} />}</div>
    </Card>
  )
}

export default VehicleDetails