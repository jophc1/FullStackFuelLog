import React, { PureComponent, useContext, useEffect, useState } from 'react'
import { PieChart, Pie, Sector, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { EmployerContext } from '../../context';

const DonutGraphVehicleUsage = () => {

  const { graphData } = useContext(EmployerContext)

  const [pieData, setPieData] = useState([])

  useEffect(() => {
    (async () => {
      const data = await graphData("reports/graph/pie/vehicles/usage/all/time", "pie")
      setPieData(data.vehicles)
    })()
  }, [])

  // colours on the pie graph
  const COLORS = ['#0088FE', '#00C49F', '#FF80FF', '#FFBB28', '#FF8042'];

  // creating a custom label for the pie graph
  const RADIAN = Math.PI / 180;

  const pieCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {

    const radius = innerRadius + (outerRadius - innerRadius) * 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text fontSize={15} x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}% ${pieData[index].vehicleID[0].asset_id} ${pieData[index].totalUsageforVehicle} L`}
      </text>
    )
  }

  return (
    pieData && <div className='pieContainer'>
                  <h4>Vehicle total fuel usage all time</h4>
                  <ResponsiveContainer width={'100%'} height="100%">
                          <PieChart width={500} height={500}>
                            <Pie
                              title='test'
                              data={pieData}
                              dataKey="totalUsageforVehicle"
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={90}
                              fill="#82ca9d"
                              label={pieCustomLabel}
                            >
                              {pieData.map((_, index) => (
                              <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                </div>
  );

}

export default DonutGraphVehicleUsage

