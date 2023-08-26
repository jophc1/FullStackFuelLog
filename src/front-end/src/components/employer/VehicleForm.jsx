import React, { useState } from 'react'

const VehicleForm = () => {

  const [selectedFile, setSelectedFile] = useState(null)

  const handleSubmit = event => {
    event.preventDefault()
    console.log(event)
  }

  return <>
    <h3>Add Vehicle</h3>
    <form>
      <div>
        <label>Car Make</label>
        <input type="text" />
        <label>Model</label>
        <input type="text" />
        <label>Year</label>
        <input type="text" />
        <label>Asset ID</label>
        <input type="text" />
        <label>Registration</label>
        <input type="text" />
      </div>
      <div>
        <input type="file" value={selectedFile} onChange={event => console.log(event)} />
      </div>
      <input type="submit" value="Submit" />
    </form>
  </>
}

export default VehicleForm