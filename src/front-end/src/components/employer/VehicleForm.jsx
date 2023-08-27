import React, { useState, useContext } from 'react'
import { EmployerContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton.jsx'

const VehicleForm = ({ makeInit = '', modelInit = '', yearInit = '', assetIdInit = '', regoInit = '', method = 'POST', urlSuffix = 'vehicles'  }) => {

  const { postUpdateVehicle } = useContext(EmployerContext)

  const [make, setMake] = useState(makeInit)
  const [model, setModel] = useState(modelInit)
  const [year, setYear] = useState(yearInit)
  const [assetId, setAssetId] = useState(assetIdInit)
  const [rego, setRego] = useState(regoInit)
  const [selectedFile, setSelectedFile] = useState(null)

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

  return <>
    <h3>Add Vehicle</h3>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Car Make</label>
        <input type="text" value={make} onChange={event => setMake(event.target.value)} />
        <label>Model</label>
        <input type="text" value={model} onChange={event => setModel(event.target.value)} />
        <label>Year</label>
        <input type="text" value={year} onChange={event => setYear(event.target.value)} />
        <label>Asset ID</label>
        <input type="text" value={assetId} onChange={event => setAssetId(event.target.value)} />
        <label>Registration</label>
        <input type="text" value={rego} onChange={event => setRego(event.target.value)} />
      </div>
      <div>
        <input type="file" onChange={event => setSelectedFile(event.target.files[0], 'image')} />
      </div>
      <CompanyButton>Sumbit</CompanyButton>
    </form>
  </>
}

export default VehicleForm