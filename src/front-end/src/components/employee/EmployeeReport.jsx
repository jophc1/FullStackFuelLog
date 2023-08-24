import React, { useEffect, useState } from 'react'
import fetchMod from '../../fetch/fetch.js'

const EmployeeReport = () => {
  const [employeeReport, setEmployeeReport] = useState({})

  useEffect(() =>{
    (async () => {
      const res = await fetchMod('GET', 'reports/employee/current/month', '')
      setEmployeeReport(res)
    })()
  }, [])

  return (
    <div>
      <table>
        <tr>
          <th><h3>Current monthly report</h3></th>
        </tr>
        <tr>
          <td>Fuel Total:</td>
          <td>{employeeReport.fuelTotal} L</td>
        </tr>
        <tr>
          <td>Vehicles Used:</td>
          <td>{employeeReport.totalFuelLogs}</td>
        </tr>
        <tr>
          <td>Log Entries:</td>
          <td>{employeeReport.vehicleCount}</td>
        </tr>
      </table>
    </div>
  )
}

export default EmployeeReport