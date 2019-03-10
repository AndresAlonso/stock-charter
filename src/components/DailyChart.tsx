import React from 'react'

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export const DailyChart = ({ symbol, data }: any) => {
  return (
    <div>
      <div className="SP__chartLabel">{`${symbol}`}</div>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart className="SP__chart" data={data}>
          <Area
            type="monotone"
            dataKey="close"
            stroke="#4caf50"
            fill="#4caf50"
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="tradingDay" />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
