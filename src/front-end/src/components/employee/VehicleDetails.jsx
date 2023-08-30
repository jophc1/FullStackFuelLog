import React, { useContext, useEffect, useState } from 'react'
import Card from '../styled/ProfileCard'
import { FuelLogContext } from '../../context.js'
import Row from '../styled/Row'

const VehicleDetails = ({ displayDetails, data }) => {

  const { currentVehicle } = useContext(FuelLogContext)

  let isVehicleImageReady = false

  if (currentVehicle) {
    const vehicleImage = new Image()
    vehicleImage.src = currentVehicle.vehicleImage_URL
    vehicleImage.onload = async () => isVehicleImageReady = true
  }

  return displayDetails &&
    <Card className='vehicleCard'>
      <Row className='vehicleRow'>
        <div>
          <table>
            <tbody>
            <tr>
              <td>Asset ID:</td>
              <td>{isVehicleImageReady ? <></> : data.asset_id}</td>
            </tr>
            <tr>
              <td>Reg No:</td>
              <td>{isVehicleImageReady ? <></> : data.registration}</td>
            </tr>
            <tr>
              <td>Make:</td>
              <td>{isVehicleImageReady ? <></> : data.make}</td>
            </tr>
            <tr>
              <td>Model:</td>
              <td>{isVehicleImageReady ? <></> : data.model}</td>
            </tr>
            <tr>
              <td>Year:</td>
              <td>{isVehicleImageReady ? <></> : data.year}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className='vehicleImg' >{isVehicleImageReady ? <img src={data.placeHolderImage} />  : <img src={data.vehicleImage_URL} />}</div>
      </Row> 
    </Card>
}

export default VehicleDetails