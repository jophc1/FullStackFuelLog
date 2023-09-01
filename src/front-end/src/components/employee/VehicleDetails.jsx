import React, { useContext } from 'react'
import Card from '../styled/ProfileCard'
import { FuelLogContext } from '../../context.js'
import Row from '../styled/Row'

const VehicleDetails = ({ displayDetails, data, style = '' }) => {

  const { currentVehicle } = useContext(FuelLogContext)

  let isVehicleImageReady = false

  if (currentVehicle.vehicleImage_URL) {
    const vehicleImage = new Image()
    vehicleImage.src = currentVehicle.vehicleImage_URL
    vehicleImage.onload = async () => isVehicleImageReady = true
  }

  return displayDetails &&
    <Card className={'vehicleCard ' + `${style}`}>
      <Row className='vehicleRow'>
        <div className='vehicleDetailTable'>
          <table>
            <tbody>
            <tr>
              <th className='fixedColumn colorVD'>Asset ID:</th>
              <td>{isVehicleImageReady ? <></> : data.asset_id}</td>
            </tr>
            <tr>
              <th className='fixedColumn colorVD'>Reg No:</th>
              <td>{isVehicleImageReady ? <></> : data.registration}</td>
            </tr>
            <tr>
              <th className='fixedColumn colorVD'>Make:</th>
              <td>{isVehicleImageReady ? <></> : data.make}</td>
            </tr>
            <tr>
              <th className='fixedColumn colorVD'>Model:</th>
              <td>{isVehicleImageReady ? <></> : data.model}</td>
            </tr>
            <tr>
              <th className='fixedColumn colorVD'>Year:</th>
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