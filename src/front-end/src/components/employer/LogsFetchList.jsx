import React, { useEffect, useContext } from 'react'
import { EmployerContext } from '../../context.js'
import FetchHeader from './FetchHeader.jsx'

const LogsFetchList = () => {

  const { getAllLogs, allLogs } = useContext(EmployerContext)

  const handleLogClick = event => {

  }

  const handleEditClick = event => {

  }

  const handleDeleteIconClick = event => {

  }

  useEffect(() => {
    (async () => getAllLogs())()
  }, [])

  return allLogs &&
    <>
      <h3>All Log Records</h3>
      <div className='allVehiclesEmployesLogs'>
        <table>
          <tbody>
            {allLogs.map(log => (
              <tr key={log._id} onClick={handleLogClick}>
                <td value={log._id} onClick={handleDeleteIconClick}><span value={log._id} className='fa fa-trash-alt'></span></td>
                <td>Log ID:</td>
                <td>{log._id}</td>
                <td>Log Date:</td>
                <td>{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
}

export default LogsFetchList