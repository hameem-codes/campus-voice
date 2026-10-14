'use client'

import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts'

interface RealChartProps {
  title?: string
  defaultRange?: '7' | '30' | '90'
}

export function RealChart({
  title = 'Views across published updates',
  defaultRange = '30',
}: RealChartProps) {
  const [range, setRange] = useState<'7' | '30' | '90'>(defaultRange)

  const data = useMemo(() => {
    if (range === '7') {
      return [
        { label: 'Wed 07', views: 320, reads: 260 },
        { label: 'Thu 08', views: 480, reads: 390 },
        { label: 'Fri 09', views: 610, reads: 540 },
        { label: 'Sat 10', views: 240, reads: 190 },
        { label: 'Sun 11', views: 180, reads: 150 },
        { label: 'Mon 12', views: 820, reads: 710 },
        { label: 'Tue 13', views: 950, reads: 840 },
      ]
    }
    if (range === '90') {
      return [
        { label: 'Aug W1', views: 2400, reads: 1950 },
        { label: 'Aug W2', views: 2800, reads: 2200 },
        { label: 'Aug W3', views: 3100, reads: 2500 },
        { label: 'Aug W4', views: 3600, reads: 2900 },
        { label: 'Sep W1', views: 4200, reads: 3400 },
        { label: 'Sep W2', views: 4900, reads: 4100 },
        { label: 'Sep W3', views: 4600, reads: 3800 },
        { label: 'Sep W4', views: 5100, reads: 4300 },
        { label: 'Oct W1', views: 5800, reads: 4900 },
        { label: 'Oct W2', views: 6400, reads: 5500 },
      ]
    }
    // 30 days
    return [
      { label: 'Sep 14', views: 480, reads: 390 },
      { label: 'Sep 17', views: 590, reads: 470 },
      { label: 'Sep 20', views: 520, reads: 430 },
      { label: 'Sep 23', views: 680, reads: 550 },
      { label: 'Sep 26', views: 740, reads: 610 },
      { label: 'Sep 29', views: 860, reads: 720 },
      { label: 'Oct 02', views: 650, reads: 540 },
      { label: 'Oct 05', views: 790, reads: 670 },
      { label: 'Oct 08', views: 910, reads: 780 },
      { label: 'Oct 11', views: 880, reads: 730 },
      { label: 'Oct 13', views: 960, reads: 840 },
    ]
  }, [range])

  const totalViews = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.views, 0)
  }, [data])

  return (
    <section className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 className="panel-title" style={{ margin: 0 }}>
            {title}
          </h2>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            Total {totalViews.toLocaleString()} views recorded
          </span>
        </div>
        <div className="segmented">
          <button
            type="button"
            className={range === '7' ? 'active' : ''}
            onClick={() => setRange('7')}
          >
            7 days
          </button>
          <button
            type="button"
            className={range === '30' ? 'active' : ''}
            onClick={() => setRange('30')}
          >
            30 days
          </button>
          <button
            type="button"
            className={range === '90' ? 'active' : ''}
            onClick={() => setRange('90')}
          >
            90 days
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="label"
              stroke="var(--text-3)"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              stroke="var(--text-3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload
                  return (
                    <div
                      style={{
                        background: '#FFFDF5',
                        border: '2.5px solid #000',
                        borderRadius: '0',
                        padding: '8px 12px',
                        boxShadow: '4px 4px 0 0 #000',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#000', textTransform: 'uppercase' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 12, color: '#000', marginTop: 4, fontWeight: 700 }}>
                        Views: <strong>{item.views.toLocaleString()}</strong>
                      </div>
                      <div style={{ fontSize: 11, color: '#000', fontWeight: 700 }}>
                        Reads: <strong>{item.reads.toLocaleString()}</strong>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="views" radius={[0, 0, 0, 0]} stroke="#000" strokeWidth={2}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === data.length - 1 ? '#FF6B6B' : '#FFD93D'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
