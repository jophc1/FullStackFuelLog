import React, { useEffect, useContext } from 'react'
import CompanyButton from '../styled/CompanyButton.jsx'
import { EmployerContext, FuelLogContext } from '../../context.js'
import FetchHeader from './FetchHeader.jsx'

const VehiclesListFetch = () => {
  const { allVehicles, getAllVehicles } = useContext(FuelLogContext)
  const { deleteVehicle, editVehicle } = useContext(EmployerContext)

  const handleEditClick = event => {
    event.preventDefault()
    editVehicle(event.target.value)
  }

  const handleDeleteClick = event => {
    event.preventDefault()
    // modal text
    //deleteVehicle(event.target.attributes.value.value)
  }

  useEffect(() => {
    (async () => setTimeout(() => {
      // timeout to wait for icons to load
      getAllVehicles()
    }, 500))()
  }, [])

  return allVehicles && <>
    <FetchHeader buttonText={'Add Vehicle'} />
    <div id='allVehicles'>
      <table>
        <tbody>
          {allVehicles.map(vehicle => (
            <tr key={vehicle.asset_id}>
              <td><CompanyButton value={vehicle.asset_id} onClick={handleEditClick}>Edit</CompanyButton></td>
              <td value={vehicle.asset_id} onClick={handleDeleteClick}><span value={vehicle.asset_id} className='fa fa-trash-alt'></span></td>
              <td>Asset ID:</td>
              <td>{vehicle.asset_id}</td>
              <td>Registration No:</td>
              <td>{vehicle.registration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
}

export default VehiclesListFetch