import React, { useEffect, useContext } from 'react'
import CompanyButton from '../styled/CompanyButton.jsx'
import { EmployerContext, FuelLogContext } from '../../context.js'
import SearchButton from './SearchButton.jsx'

const VehiclesListFetch = () => {
  const { allVehicles, getAllVehicles } = useContext(FuelLogContext)
  const { deleteVehicle } = useContext(EmployerContext)

  const handleEditClick = event => {
    event.preventDefault()
  }

  const handleDeleteClick = event => {
    event.preventDefault()
    deleteVehicle(event.target.attributes.value.value)
  }

  useEffect(() => {
    (async () => await getAllVehicles())()
  }, [])

  return allVehicles && <>
    <SearchButton buttonText={'Add Vehicle'} />
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