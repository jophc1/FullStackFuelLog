import React, { useEffect, useState } from 'react'
import fetchMod from '../../fetch/fetch.js'

const EmployeeReport = () => {
  const [employeeReport, setEmployeeReport] = useState({})

  useEffect(() =>{
    (async () => {
      const res = await fetchMod('GET', 'reports/employee/current/month', '')
      setEmployeeReport(res.body)
    })()
  }, [])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th><h3>Current monthly report</h3></th>
          </tr>
        </thead>
        <tbody>
          <tr>
          <td>Fuel Total:</td>
          <td>{employeeReport.fuelTotal} L</td>
        </tr>
        <tr>
          <td>Vehicles Used:</td>
          <td>{employeeReport.vehicleCount}</td>
        </tr>
        <tr>
          <td>Log Entries:</td>
          <td>{employeeReport.totalFuelLogs}</td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

export default EmployeeReport