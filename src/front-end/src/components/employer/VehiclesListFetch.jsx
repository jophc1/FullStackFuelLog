import React, { useEffect, useContext, useRef, useState } from 'react'
import CompanyButton from '../styled/CompanyButton.jsx'
import { EmployerContext, FuelLogContext } from '../../context.js'
import FetchHeader from './FetchHeader.jsx'
import ModalText from '../ModalText.jsx'

const VehiclesListFetch = () => {
  const { allVehicles, getAllVehicles, modalTextOperation, navigate, editVehicle, deleteVehicle } = useContext(FuelLogContext)
  const [modalRender, setModalRender] = useState(false)
  const [assetId, setAssetId] = useState('')
  const assetID = useRef('')

  const handleEditClick = event => {
    event.preventDefault()
    editVehicle(event.target.value)
  }

  const handleDeleteIconClick = event => {
    event.preventDefault()
    assetID.current = event.target.attributes.value.value
    // turn modal on
    setModalRender(true)
    modalTextOperation(true)
  }

  const handleCompanyButtonClick = async event => {
    event.preventDefault()
    await deleteVehicle(event.target.value)

    setModalRender(false)
    modalTextOperation(false)
  }

  const handleNewVehicle = event => {
    navigate('/employer/dashboard/vehicle/new')
  }

  async function handleSearchSubmit (event) {
    event.preventDefault()
  }

  useEffect(() => {
    (async () => await getAllVehicles())()
  }, [])

  return <>
    <h3>All Vehicles</h3>
    <FetchHeader>
        <form className='search' onSubmit={handleSearchSubmit}>
          <input type="text" placeholder='Search by AssetID' value={assetId} onChange={event => setAssetId(event.target.value)} />
          <span className='fa fa-search'></span>
        </form>
      <CompanyButton onClick={handleNewVehicle}><span className='fa fa-plus'></span> Add Vehicle</CompanyButton>
    </FetchHeader>
    {allVehicles && 
      <div className='allVehiclesEmployesLogs'>
            <table>
              <tbody>
                {allVehicles.map(vehicle => (
                  <tr key={vehicle.asset_id}>
                    <th className='fixedColumn'><CompanyButton value={vehicle.asset_id} onClick={handleEditClick}>Edit</CompanyButton></th>
                    <th className='fixedColumnTwo' value={vehicle.asset_id} onClick={handleDeleteIconClick}><span value={vehicle.asset_id} className='fa fa-trash-alt'></span></th>
                    <td>Asset ID:</td>
                    <td>{vehicle.asset_id}</td>
                    <td>Registration No:</td>
                    <td>{vehicle.registration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    }
    { modalRender &&
    <ModalText setRenderModal={setModalRender}>
      <p>Are you sure you want to delete this Vehicle?</p>
      <CompanyButton onClick={handleCompanyButtonClick} value={assetID.current}>Confirm</CompanyButton>
    </ModalText>}
  </>
}

export default VehiclesListFetch