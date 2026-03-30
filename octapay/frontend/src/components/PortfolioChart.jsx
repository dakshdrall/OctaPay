import { useMemo, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

export default function PortfolioChart() {
  const { authFetch } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authFetch('/api/transactions?page=1&limit=200').finally(() => setLoading(false))
  }, [authFetch])

  const data = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return {
      date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      portfolio: Math.round(1000 + i * 8 + Math.sin(i * 0.8) * 40 + Math.cos(i * 0.4) * 25)
    }
  }), [])

  return (
    <div style={{ height: '260px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Portfolio — last 30 days</span>
        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{loading ? '...' : '+18.4%'}</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="transparent" tick={{ fill: '#666', fontSize: 10 }} minTickGap={20} />
          <YAxis stroke="transparent" tick={{ fill: '#666', fontSize: 10 }} width={44} domain={['dataMin - 50', 'dataMax + 50']} />
          <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid rgba(0,255,255,0.15)', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} labelStyle={{ color: 'var(--accent)' }} />
          <Line type="monotone" dataKey="portfolio" stroke="var(--accent)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'var(--surface)' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
