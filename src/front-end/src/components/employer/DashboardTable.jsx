import React, { useEffect, useState } from 'react'
import fetchMod from '../../fetch/fetch'

const DashboardTable = () => {
  
  // const [employerTableDate, setEmployerTableData] = useState({})

  

  // on change, parse dates and compare against each other to see if the 'from' is further ahead of the 'to'
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => {
      // (async () => {
      //   const res = await fetchMod('GET', 'reports/2023/08/01/to/2023/08/20', '') // TODO: input dates from input fields into here
      //   setEmployerTableData(res.body)
      //   console.log(employerTableDate)
      // })()
    }, [fromDate, toDate])

  function handleEmployerTableDate(event) {
    if (event.target.name === 'to-date'){
      setToDate(event.target.value)
    } else {
      setFromDate(event.target.value)
    }
      console.log(toDate, fromDate)
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
          <td>!!trip record logs here!!</td>
        </tr>
        <tr>
          <td>Total fuel usage:</td>
          <td>!!fuel details here!! L</td>
        </tr>
        <tr>
          <td>Total distance travelled:</td>
          <td>!!total distance here!!</td>
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
      
     
      

  </div>
    
  </>
}

export default DashboardTable