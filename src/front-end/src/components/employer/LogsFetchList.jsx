import React, { useEffect, useContext, useRef, useState } from 'react'
import { EmployerContext, FuelLogContext } from '../../context.js'
import FetchHeader from './FetchHeader.jsx'
import ModalText from '../ModalText.jsx'

const LogsFetchList = () => {

  const { getAllLogs, allLogs, deleteLog } = useContext(EmployerContext)
  const { modalTextOperation } = useContext(FuelLogContext)
  const [renderModal, setRenderModal] = useState(false)
  const selectedLog = useRef({})
  const logID = useRef('')

  const handleLogClick = event => {
    event.preventDefault()
    selectedLog.current = allLogs.find(log => log._id === event.target.attributes.value.value)
    logID.current = allLogs.length - allLogs.map(obj => obj._id).indexOf(event.target.attributes.value.value)
    modalTextOperation(true)
    setRenderModal(true)
  }

  const handleDeleteIconClick = event => {

  }

  useEffect(() => {
    (async () => getAllLogs())()
  }, [])

  return allLogs &&
    <>
      <h3>All Log Records</h3>
      <div className='allLogs'>
        <table>
          <tbody>
            {allLogs.map((log, index) => (
              <tr key={log._id}>
                <td value={log._id} onClick={handleDeleteIconClick}><span value={log._id} className='fa fa-trash-alt'></span></td>
                <td onClick={handleLogClick} value={log._id}>Log ID:</td>
                <td onClick={handleLogClick} value={log._id}>{allLogs.length - index}</td>
                <td onClick={handleLogClick} value={log._id}>Log Date:</td>
                <td onClick={handleLogClick} value={log._id}>{new Date(log.date).toISOString().split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
              </tbody>
            </table>
      </ModalText>
      }
    </>
}

export default LogsFetchList