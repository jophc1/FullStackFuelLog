import React, { useEffect, useState } from 'react'
import fetchMod from '../../fetch/fetch.js'

const EmployeeReport = () => {
  const [employeeReport, setEmployeeReport] = useState({})

  useEffect(() =>{
    (async () => {
      const res = await fetchMod('GET', 'reports/employee/current/month', '')
      console.log(res)
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
          <td>300 L</td>
        </tr>
        <tr>
          <td>Vehicles Used:</td>
          <td>2</td>
        </tr>
        <tr>
          <td>Log Entries:</td>
          <td>5</td>
        </tr>
      </table>
    </div>
  )
}

export default EmployeeReport