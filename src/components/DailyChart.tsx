import React from 'react'

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'

export const DailyChart = ({ symbol, data }: any) => {
  return (
    <div>
      <div className="SP__chartLabel">{`${symbol}`}</div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart className="SP__chart" data={data}>
          <Line type="monotone" dataKey="close" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="tradingDay" />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
