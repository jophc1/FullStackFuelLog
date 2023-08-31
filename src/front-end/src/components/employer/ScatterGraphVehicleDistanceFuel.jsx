
import React, { useContext, useState, useEffect } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { EmployerContext, FuelLogContext } from '../../context'


const ScatterGraphVehicleDistanceFuel = () => {

  const { graphData } = useContext(EmployerContext)
  const { allVehicles, getAllVehicles } = useContext(FuelLogContext)
  const [scatterData, setScatterData] = useState([])

  async function handleVehicleSelect(event) {
    const data = await graphData(`reports/graph/${event.target.value}/line/distance/`, 'scatter') // may need to convert value from object to string
    if (data.length > 0) {
      setScatterData(data)
    } else {
      setScatterData([{ distance: 0, fuelAdded: 0 }])
    }
  }

  useEffect(() => {
    const overflowContainer = document.getElementById('scatterContainer')
    overflowContainer.scrollTo(( overflowContainer.offsetWidth / 4.25 ), 0)
  }, [])

  return <>
    <div className='scatterHeader'>
      <h4>Vehicle distance vs fuel consumption</h4> 
      <select onChange={handleVehicleSelect} defaultValue={'default'}>
        <option value="default" disabled>No car selected</option>
        {allVehicles && allVehicles.map(vehicle => <option key={vehicle.asset_id} value={vehicle._id}>{vehicle.asset_id}</option>)}
      </select>
    </div>
    <div id='scatterContainer' className='scatterContainer'>
        {scatterData && 
        <div className='graphThreeDataPlot'>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              margin={{
                top: 20,
                right: 30,
                bottom: 20,
                left: 30,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="distance" name="distance travelled" unit="km" />
              <YAxis type="number" dataKey="fuelAdded" name="fuel added" unit="Litres" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="distanceVsfuel" data={scatterData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        }
      </div>   
  </>
    
  
}

export default ScatterGraphVehicleDistanceFuel