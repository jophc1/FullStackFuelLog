import React from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const BarGraphTotalVehicleUsage = () => {

  const data = [
    {
      name: 'June',
      total_fuel: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'July',
      total_fuel: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'August',
      total_fuel: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      total_fuel: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      total_fuel: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      total_fuel: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      total_fuel: 3490,
      pv: 4300,
      amt: 2100,
    },
  ]

  return (
    <div className='barContainer'>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
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
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="total_fuel" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarGraphTotalVehicleUsage