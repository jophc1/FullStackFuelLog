import React, { useEffect, useContext, useRef, useState } from 'react'
import CompanyButton from '../styled/CompanyButton.jsx'
import { FuelLogContext } from '../../context.js'
import FetchHeader from './FetchHeader.jsx'
import ModalText from '../ModalText.jsx'
import VehicleDetails from '../employee/VehicleDetails.jsx'
import noRequest from '../../assets/request.png'
import Card from '../styled/ProfileCard.jsx'

const VehiclesListFetch = () => {
  const { allVehicles, 
          getAllVehicles,
          modalTextOperation,
          navigate,
          editVehicle,
          deleteVehicle,
          errorMessage,
          modalErrorRender,
          setModalErrorRender,
          currentVehicleDetails,
          currentVehicle,
          displayVehicleInfo } = useContext(FuelLogContext)
  
  const [modalRender, setModalRender] = useState(false)
  const [assetId, setAssetId] = useState('')
  const [vehicleDetailsModal, setVehicleDetailsModal] = useState(false)
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
    // turn modal off
    setModalRender(false)
    modalTextOperation(false)
  }

  const handleNewVehicle = event => {
    navigate('/employer/dashboard/vehicle/new')
  }

  async function handleSearchSubmit (event) {
    event.preventDefault()
  }

  const handleVehicleClick = event => {
    event.preventDefault()
    setVehicleDetailsModal(true)
    currentVehicleDetails(event.target.attributes.value.value)
    modalTextOperation(true)
  }



  useEffect(() => {
    (async () => await getAllVehicles())()
  }, [])

  return <>
    <h3>All Vehicles</h3>
    <FetchHeader>
        <CompanyButton onClick={handleNewVehicle}><span className='fa fa-plus'></span> Add Vehicle</CompanyButton>
        <form className='search' onSubmit={handleSearchSubmit}>
          <input type="text" placeholder='Search by Asset ID' value={assetId} onChange={event => setAssetId(event.target.value)} />
          <span className='fa fa-search'></span>
        </form>
    </FetchHeader>
    {allVehicles ?
      <div className='allVehiclesEmployesLogs'>
            <table>
              <tbody>
                {allVehicles.map(vehicle => (
                  <tr key={vehicle.asset_id}>
                    <th className='fixedColumn'><CompanyButton value={vehicle.asset_id} onClick={handleEditClick}>Edit</CompanyButton></th>
                    <th className='fixedColumnTwo' value={vehicle.asset_id} onClick={handleDeleteIconClick}><span value={vehicle.asset_id} className='fa fa-trash-alt'></span></th>
                    <td value={vehicle.asset_id} onClick={handleVehicleClick}>Asset ID:</td>
                    <td value={vehicle.asset_id} onClick={handleVehicleClick}>{vehicle.asset_id}</td>
                    <td value={vehicle.asset_id} onClick={handleVehicleClick}>Registration No:</td>
                    <td value={vehicle.asset_id} onClick={handleVehicleClick}>{vehicle.registration}</td>
                    <td value={vehicle.asset_id} onClick={handleVehicleClick}>Make:</td>
                    <td value={vehicle.asset_id} onClick={handleVehicleClick}>{vehicle.make}</td>
                    <td value={vehicle.asset_id} onClick={handleVehicleClick}>Model:</td>
                    <td value={vehicle.asset_id} onClick={handleVehicleClick}>{vehicle.model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          :
          <Card id="request">
            <p>No vehicles added. Add a new vehicle to see in this list</p>
            <img src={noRequest} alt='company logo' />
          </Card>
    }
    { modalRender &&
    <ModalText setRenderModal={setModalRender}>
      <p>Are you sure you want to delete this Vehicle?</p>
      <CompanyButton onClick={handleCompanyButtonClick} value={assetID.current}>Confirm</CompanyButton>
    </ModalText>}
    { modalErrorRender &&
      <ModalText setRenderModal={setModalErrorRender} style={'error'}>
          <div>
          { errorMessage }
          </div>
      </ModalText>
    }
    { vehicleDetailsModal &&
       <ModalText setRenderModal={setVehicleDetailsModal} styleSpecial='vehicleModal'>
          <h4>Selected Vehicle</h4>
          {<VehicleDetails style={'employer'}  displayDetails={displayVehicleInfo} data={currentVehicle} />}
       </ModalText>
    }
  </>
}

export default VehiclesListFetch