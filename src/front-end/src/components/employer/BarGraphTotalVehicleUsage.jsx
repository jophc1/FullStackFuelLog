import React, { useContext, useEffect, useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const BarGraphTotalVehicleUsage = () => {

  // const { graphData } = useContext(EmployerContext)

  // const [barData, setBarData] = useState([])

  // useEffect(() => {
  //   (async () => {
  //     const data = await graphData('reports/graph/bar/vehicles/usage/past/6/months', 'bar')
  //     setBarData(data.body) /// remember to put in bar data here
  //   })()
  // }, [])

  const barData = [
    {
      name: 'June',
      distanceTravelledPerFill: 4000,
      totalMonthlyUsage: 2400,
      amt: 2400,
    },
    {
      name: 'July',
      distanceTravelledPerFill: 3000,
      totalMonthlyUsage: 1398,
      amt: 2210,
    },
    {
      name: 'August',
      distanceTravelledPerFill: 2000,
      totalMonthlyUsage: 9800,
      amt: 2290,
    }
  ]

  return (
    barData && <div className='barContainer'>
      <h4>All Vehicle usage past 6 months</h4>
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
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar name="total distance (km)" dataKey="distanceTravelledPerFill" fill="#8884d8" />
          <Bar name="total fuel consumed (litres)" dataKey="totalMonthlyUsage" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarGraphTotalVehicleUsage