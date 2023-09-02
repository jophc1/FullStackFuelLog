import React, { useContext, useEffect, useRef, useState } from 'react'
import { EmployerContext, FuelLogContext } from '../../context'
import ModalText from '../ModalText'

const DashboardTable = () => {
  
  // const [employerTableDate, setEmployerTableData] = useState({})
  const { errorHandler, modalErrorRender, setModalErrorRender, errorMessage } = useContext(FuelLogContext)
  const { getEmployerTableReports } = useContext(EmployerContext)
  const [reportArray, setReportArray] = useState([])
  const [renderReset, setRenderReset] = useState(true)
  const [tableData, setTableData] = useState({ totalLogsRecorded: 0, totalFuel: 0, totalDistance: 0 })
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
        // setReportArray([])
        // setTableData({ totalLogsRecorded: 0, totalFuel: 0, totalDistance: 0})
        errorHandler(<p>"From date" must be before or on "To date"</p>)
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
  <h4 className='dashboardTitle'>Reports</h4>
  <div className='reports'>
    <div>
    {fromDate.current && toDate.current ? <h5>From <span className='reportDates'>{fromDate.current}</span> <span className='fa fa-arrow-right'></span> <span className='reportDates'>{toDate.current}</span></h5> : <p>Please set date and choose vehicle</p>}
    </div>
    <div className='employer-table-dates-container'>
        <div>
          <label>From:</label>
          <label>To:</label>
        </div>
        <div>
          <input type="date" name='from-date' onChange={handleEmployerTableDate} />
          <input type="date" name='to-date' onChange={handleEmployerTableDate} />
        </div>
    </div>
    <div className='dashboard-table-vehicle'>
      <label>Select Vehicle:</label>
      {renderReset && <select onChange={selectedVehicle} defaultValue={'default'}>
        <option value='default' disabled>No car selected</option>
        {reportArray.map(report => (report.vehicle.length > 0 && <option key={report._id.vehicle} value={report._id.vehicle}>{report.vehicle[0].asset_id}</option>))}
      </select>}
    </div>
    <div className='employerDashboardTable'>
    <table className='employer-table'>
        <tbody>
          <tr>
          <th className='fixedColumn'>New trips recorded:</th>
          <td>{tableData && tableData.totalLogsRecorded}</td>
        </tr>
        <tr>
          <th className='fixedColumn'>Total fuel usage:</th>
          <td>{tableData && tableData.totalFuel} L</td>
        </tr>
        <tr>
          <th className='fixedColumn'>Total distance travelled between trips:</th>
          <td>{tableData && tableData.totalDistance} km</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  { modalErrorRender &&
        <ModalText setRenderModal={setModalErrorRender} style={'error'}>
            <div>
              { errorMessage }
            </div>
        </ModalText>
  }
  </>
}

export default DashboardTable