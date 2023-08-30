import React, { useEffect, useContext, useRef, useState } from 'react'
import { EmployerContext, FuelLogContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton.jsx'
import ModalText from '../ModalText.jsx'
import Pagination from '../Pagination.jsx'

const LogsFetchList = () => {

  const { getAllLogs, allLogs, deleteLog, paginationInfo } = useContext(EmployerContext)
  const { modalTextOperation } = useContext(FuelLogContext)
  const [renderModal, setRenderModal] = useState(false)
  const [modalDeleteRender, setModalDeleteRender] = useState(false)
  const [totalDocs, setTotalDocs] = useState(0)
  const [page, setPage] = useState(1)
  const selectedLog = useRef({})
  const logID = useRef('')

  const handleLogClick = event => {
    event.preventDefault()
    selectedLog.current = allLogs.docs.find(log => log._id === event.target.attributes.value.value)
    logID.current = (allLogs.totalDocs - allLogs.limit * (allLogs.page - 1)) - allLogs.docs.map(log => log._id).indexOf(event.target.attributes.value.value)
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

    setModalDeleteRender(false)
    modalTextOperation(false)
  }

  useEffect(() => {
    (async () => getAllLogs(page))()
    setTotalDocs(allLogs.totalDocs)
  }, [modalDeleteRender, page, renderModal])

  return paginationInfo && allLogs.docs &&
    <>
      <h3>All Log Records</h3>
      <div className='allLogs'>
        <table>
          <tbody>
            {allLogs.docs.map((log, index) => (
              <tr key={log._id}>
                <td value={log._id} onClick={handleDeleteIconClick}><span value={log._id} className='fa fa-trash-alt'></span></td>
                <td onClick={handleLogClick} value={log._id}>Log ID:</td>
                <td onClick={handleLogClick} value={log._id}>{(allLogs.totalDocs - allLogs.limit * (allLogs.page - 1)) - index }</td>
                <td onClick={handleLogClick} value={log._id}>Log Date:</td>
                <td onClick={handleLogClick} value={log._id}>{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginationInfo &&  <Pagination {...paginationInfo} setPage={setPage} /> }
      {renderModal &&
      <ModalText setRenderModal={setRenderModal}>
            <h5>Log Details</h5>
            <table>
              <tbody>
                <tr>
                  <td>Log ID:</td>
                  <td>{logID.current}</td>
                </tr>
                <tr>
                  <td>Date Added:</td>
                  <td>{new Date(selectedLog.current.date).toISOString().split('T')[0]}</td>
                </tr>
                <tr>
                  <td>Current ODO:</td>
                  <td>{selectedLog.current.current_odo}</td>
                </tr>
                <tr>
                  <td>Fuel Added:</td>
                  <td>{selectedLog.current.fuel_added}</td>
                </tr>
                <tr>
                  <td>Asset ID:</td>
                  <td>{selectedLog.current.vehicle_id.asset_id}</td>
                </tr>
                <tr>
                  <td>Employee:</td>
                  <td>{selectedLog.current.user_id.name}</td>
                </tr>
                <tr>
                  <td>Employee ID:</td>
                  <td>{selectedLog.current.user_id.username_id}</td>
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
    </>
}

export default LogsFetchList