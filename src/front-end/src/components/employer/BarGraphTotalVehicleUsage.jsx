import React, { useContext, useEffect, useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { EmployerContext } from '../../context'

const BarGraphTotalVehicleUsage = () => {
  /* CONTEXTS */
  const { graphData } = useContext(EmployerContext)
  /* ====================== */
  /* STATES */
  const [barData, setBarData] = useState([])
  /* ====================== */
  useEffect(() => {
    (async () => {
      const data = await graphData('reports/graph/bar/vehicles/usage/past/6/months', 'bar')
      const sortedData = data.sort((record1,record2) => record1.month - record2.month)
      setBarData(sortedData) 
    })()
  }, [])

  return (<>
  <h4 id='barTitle'>All Vehicle usage past 6 months</h4>
  {barData && <div className='barContainer'>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={barData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar name="Total distance (km)" dataKey="totalMonthlyDistance" fill="#8884d8" />
          <Bar name="Total fuel consumed (litres)" dataKey="totalMonthlyUsage" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>}
  </>
  )
}

export default BarGraphTotalVehicleUsage