import { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

function createSimulatedData() {
  const data = []
  let value = 1000
  const now = new Date()

  for (let i = 29; i >= 0; i -= 1) {
    const day = new Date(now)
    day.setDate(now.getDate() - i)
    const dayLabel = day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

    const noise = (Math.random() - 0.5) * 15
    const drift = 2
    value = Math.max(400, value + drift + noise)

    data.push({ date: dayLabel, portfolio: Number(value.toFixed(2)) })
  }

  return data
}

export default function PortfolioChart() {
  const data = useMemo(() => createSimulatedData(), [])

  return (
    <div className="h-72 w-full rounded-2xl bg-slate-900 p-3">
      <h3 className="px-2 text-sm font-semibold text-slate-300">Portfolio value (last 30 days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fill: '#cbd5e1', fontSize: 11 }}
            minTickGap={8}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#cbd5e1', fontSize: 11 }}
            width={48}
            domain={['dataMin - 50', 'dataMax + 50']}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #334155',
              color: '#e2e8f0',
            }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Line
            type="monotone"
            dataKey="portfolio"
            stroke="#6366f1"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, stroke: '#c7d2fe', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
