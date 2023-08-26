import React, { useContext, useEffect, useRef, useState } from 'react'
import { EmployerContext } from '../../context'

const DashboardTable = () => {
  
  // const [employerTableDate, setEmployerTableData] = useState({})
  const { getEmployerTableReports } = useContext(EmployerContext)
  const [reportArray, setReportArray] = useState([])
  const [renderReset, setRenderReset] = useState(true)
  const [tableData, setTableData] = useState({})
  const toDate = useRef('')
  const fromDate = useRef('')
  
  useEffect(() => {
    setRenderReset(true)
  }, [reportArray])

  // on change, parse dates and compare against each other to see if the 'from' is further ahead of the 'to'

  async function handleEmployerTableDate(event) {

    if (event.target.name === 'to-date'){
      toDate.current = event.target.value
    } else {
      fromDate.current = event.target.value
    }
    // check that both dates are defined
    if (toDate.current && fromDate.current) {
      const formatToDateString = toDate.current.split('-')
      const formatFromDateString = fromDate.current.split('-')
  
      if (new Date(fromDate.current) <= new Date(toDate.current)){
        const reports = await getEmployerTableReports(formatFromDateString, formatToDateString)
        setReportArray(reports)
       
      } else {
        setReportArray([])
        setTableData({ totalLogsRecorded: 0, totalFuel: 0, totalDistance: 0})
      }
      
      setRenderReset(false)
    }
  }

  function selectedVehicle(event) {
    const tableData = reportArray.find(report => report._id.vehicle === event.target.value)
    setTableData(tableData)
  }


  // when dates are confirmed, send a request to retrieve all the reports on all cars

  // use the car asset ID to populate a dropdown menu with all the availiable cars 

  // when a car asset ID is selected (onChange), filter out the array report to get the correct one and use it to populate the table

  return <>
  <div>
    <h4>first date here - other date here analytics</h4>
    <table className='employer-table'>
        <tbody>
          <tr>
          <td>New trips recorded:</td>
          <td>{tableData && tableData.totalLogsRecorded}</td>
        </tr>
        <tr>
          <td>Total fuel usage:</td>
          <td>{tableData && tableData.totalFuel} L</td>
        </tr>
        <tr>
          <td>Total distance travelled:</td>
          <td>{tableData && tableData.totalDistance} km</td>
        </tr>
        </tbody>
      </table>

      <div className='employer-table-dates-container'>
        <div>
          <label>From</label>
          <input type="date" name='from-date' onChange={handleEmployerTableDate} />
        </div>
        <div>
          <label>To</label>
          <input type="date" name='to-date' onChange={handleEmployerTableDate} />
        </div>
      </div>

      <label>Select Vehicle:</label>
      {renderReset && <select onChange={selectedVehicle} defaultValue={'default'}>
        <option value='default' disabled>No car selected</option>
        {reportArray.map(report => (report.vehicle.length > 0 && <option key={report._id.vehicle} value={report._id.vehicle}>{report.vehicle[0].asset_id}</option>))}
      </select>}
      
  
  </div>
    
  </>
}

export default DashboardTable