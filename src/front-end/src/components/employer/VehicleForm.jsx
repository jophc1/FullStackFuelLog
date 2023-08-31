import React, { useState, useContext } from 'react'
import { EmployerContext, FuelLogContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton.jsx'
import placeholderImage from '../../assets/no-image.png'

const VehicleForm = ({ makeInit = '', modelInit = '', yearInit = '', assetIdInit = '', regoInit = '', previewImageInit = placeholderImage, method = 'POST', urlSuffix = 'vehicles', heading = 'Add Vehicle'  }) => {

  const { postUpdateVehicle } = useContext(EmployerContext)
  const { backButton } = useContext(FuelLogContext)

  const [make, setMake] = useState(makeInit)
  const [model, setModel] = useState(modelInit)
  const [year, setYear] = useState(yearInit)
  const [assetId, setAssetId] = useState(assetIdInit)
  const [rego, setRego] = useState(regoInit)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(previewImageInit)

  const handleSubmit = event => {
    event.preventDefault()
    postUpdateVehicle({
      make: make,
      model: model,
      year: year,
      asset_id: assetId,
      registration: rego,
      image: selectedFile,
      method: method,
      urlSuffix: urlSuffix
    })
  }

  const handleSelectedFile = event => {
    event.preventDefault()
    setSelectedFile(event.target.files[0], 'image')
    setPreviewImage(URL.createObjectURL(event.target.files[0]))
  }

  const handleBackButtonClick = event => {
    event.preventDefault()
    backButton('/employer/dashboard/all/vehicles')
  }

  return <>
    <div className='vehicleForm'>
      <h3>{heading}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Car Make</label>
          <input type="text" value={make} onChange={event => setMake(event.target.value)} />     
        </div>
        <div>
          <label>Model</label>
          <input type="text" value={model} onChange={event => setModel(event.target.value)} />
        </div>
        <div>
          <label>Year</label>
          <input type="text" value={year} onChange={event => setYear(event.target.value)} />
        </div>
        <div>
          <label>Asset ID</label>
          <input type="text" value={assetId} onChange={event => setAssetId(event.target.value)} />
        </div>
        <div>
          <label>Registration</label>
          <input type="text" value={rego} onChange={event => setRego(event.target.value)} />
        </div>
        <div>
          <label>Upload Vehicle Image:</label>
          <input id='inputFile' type="file" name='fileButton' onChange={handleSelectedFile} />
        </div>
        { previewImage && 
        <div id='previewImage'>
          <img src={previewImage} alt="uploaded image" />
        </div>
        }
        <div>
          <CompanyButton onClick={handleBackButtonClick}>&larr; BACK</CompanyButton>
          <CompanyButton>Submit</CompanyButton>
        </div>
      </form>
    </div>
  </>
}

export default VehicleForm