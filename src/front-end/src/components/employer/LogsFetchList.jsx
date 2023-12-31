import React, { useEffect, useContext, useRef, useState } from 'react'
import { EmployerContext, FuelLogContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton.jsx'
import ModalText from '../ModalText.jsx'
import Pagination from '../Pagination.jsx'

const LogsFetchList = () => {
  /* CONTEXTS */
  const { getAllLogs,
          allLogs,
          deleteLog,
          paginationInfo,
          errorMessage,
          modalErrorRender,
          setModalErrorRender } = useContext(EmployerContext)
  const { modalTextOperation } = useContext(FuelLogContext)
  /* ====================== */
  /* STATES */
  const [renderModal, setRenderModal] = useState(false)
  const [modalDeleteRender, setModalDeleteRender] = useState(false)
  const [page, setPage] = useState(1)
  const [assetId, setAssetId] = useState('')
  const selectedLog = useRef({})
  const logID = useRef('')
  const toDate = useRef('')
  const fromDate = useRef('')
  /* ====================== */
  /* EVENT HANDLER FUNCTIONS */
  const handleLogClick = event => {
    event.preventDefault()
    // filter the selected log
    selectedLog.current = allLogs.find(log => log._id === event.target.attributes.value.value)
    // turn modal on
    modalTextOperation(true)
    setRenderModal(true)
  }

  const handleDeleteIconClick = event => {
    event.preventDefault()
    logID.current = event.target.attributes.value.value
    // turn modal on
    setModalDeleteRender(true)
    modalTextOperation(true)
  }

  const handleCompanyButtonClick = event => {
    event.preventDefault()
    deleteLog(event.target.value)
    // turn modal off
    setModalDeleteRender(false)
    modalTextOperation(false)
  }

  async function handleSearchSubmit (event) {
    event.preventDefault()
    // check if filter dates have a value
    if (toDate.current && fromDate.current) {
      if (new Date(fromDate.current) <= new Date(toDate.current)){
        await getAllLogs(page, 'vehicleDate', toDate.current, fromDate.current, assetId)
      }
    } else {
       await getAllLogs(page, 'vehicle', '', '', assetId)
    }
  }

  async function handleFilterDates (event) {
    event.preventDefault()
    if (event.target.name === 'to-date'){
      toDate.current = event.target.value
    } else {
      fromDate.current = event.target.value
    }
  }
  /* ====================== */
  useEffect(() => {
    (async () => getAllLogs(page))()
    setAssetId('')
  }, [modalDeleteRender, page, renderModal])

  return paginationInfo && allLogs &&
    <>
      <h3>All Log Records</h3>
      <div id='logsHeader'>
        <div id='logDates'>
          <p>Filter search by dates</p>
          <div>
            <label>From:</label>
            <input type="date" name='from-date' onChange={handleFilterDates} />
            <label>To:</label>
            <input type="date" name='to-date'  onChange={handleFilterDates} />
          </div>
        </div>
        <div>
          <form className='search' onSubmit={handleSearchSubmit}>
            <input type="text" placeholder='Search by Asset ID' value={assetId} onChange={event => setAssetId(event.target.value)} />
            <span className='fa fa-search'></span>
          </form>
        </div>
      </div>
      <div className='allLogs'>
        <table>
          <tbody>
            {allLogs.map((log, index) => (
              <tr key={log._id}>
                <td value={log._id} onClick={handleDeleteIconClick}><span value={log._id} className='fa fa-trash-alt'></span></td>
                <td onClick={handleLogClick} value={log._id}>Log Date:</td>
                <td onClick={handleLogClick} value={log._id}>{log.date}</td>
                <td onClick={handleLogClick} value={log._id}>Asset ID:</td>
                <td onClick={handleLogClick} value={log._id}>{log.vehicle_id?.asset_id ?? <>deleted</>}</td>
                <td onClick={handleLogClick} value={log._id}>Employee ID:</td>
                <td onClick={handleLogClick} value={log._id}>{log.user_id?.username_id ?? <>deleted</>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginationInfo.totalPages > 1 &&  <Pagination {...paginationInfo} setPage={setPage} /> }
      {renderModal &&
      <ModalText setRenderModal={setRenderModal}>
            <h5>Log Details</h5>
            <table id='logModalDetails'>
              <tbody>
                <tr>
                  <td>Date Added:</td>
                  <td>&rarr; {new Date(selectedLog.current.date).toISOString().split('T')[0]}</td>
                </tr>
                <tr>
                  <td>Current ODO (km):</td>
                  <td>&rarr; {selectedLog.current.current_odo}</td>
                </tr>
                <tr>
                  <td>Fuel Added (L):</td>
                  <td>&rarr; {selectedLog.current.fuel_added}</td>
                </tr>
                <tr>
                  <td>Asset ID:</td>
                  <td>&rarr; {selectedLog.current.vehicle_id ? selectedLog.current.vehicle_id.asset_id : <>deleted</>}</td>
                </tr>
                <tr>
                  <td>Employee:</td>
                  <td>&rarr; {selectedLog.current.user_id ? selectedLog.current.user_id.name : <>deleted</>}</td>
                </tr>
                <tr>
                  <td>Employee ID:</td>
                  <td>&rarr; {selectedLog.current.user_id ? selectedLog.current.user_id.username_id : <>deleted</>}</td>
                </tr>
              </tbody>
            </table>
      </ModalText>
      }
      { modalDeleteRender &&
          <ModalText setRenderModal={setModalDeleteRender}>
            <p>Are you sure you want to delete this Log?</p>
            <CompanyButton onClick={handleCompanyButtonClick} value={logID.current}>Confirm</CompanyButton>
          </ModalText>
      }
      { modalErrorRender &&
      <ModalText setRenderModal={setModalErrorRender} style={'notification'}>
          <div>
          { errorMessage }
          </div>
      </ModalText>
    }
    </>
}

export default LogsFetchList