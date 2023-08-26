import React, { useState } from 'react'

const VehicleForm = () => {

  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [assetId, setAssetId] = useState('')
  const [rego, setRego] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const handleSubmit = event => {
    event.preventDefault()
    console.log(event)
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
        <input type="file" value={selectedFile} onChange={event => setSelectedFile(event.target.value)} />
      </div>
      <input type="submit" value="Submit" />
    </form>
  </>
}

export default VehicleForm