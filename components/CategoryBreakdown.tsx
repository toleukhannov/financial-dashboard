'use client'

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Category } from '@/types'

interface Props {
  categories: Category[]
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function CategoryBreakdown({ categories }: Props) {
  const total = categories.reduce((sum, c) => sum + c.total, 0)

  return (
     <div style={{
       background: 'var(--color-background-primary)',
       border: '0.5px solid var(--color-border-tertiary)',
       borderRadius: 12,
       padding: '20px 16px',
     }}>
       <p style={{
         fontSize: 13,
         fontWeight: 500,
         color: 'var(--color-text-secondary)',
         marginBottom: 16,
       }}>
         Расходы по категориям
       </p>

       <ResponsiveContainer width="100%" height={180}>
         <PieChart>
           <Pie
              data={categories}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="total"
              nameKey="name"
              paddingAngle={2}
           >
             {categories.map((cat, i) => (
                <Cell key={i} fill={cat.color} />
             ))}
           </Pie>
           <Tooltip
              formatter={(value) => [formatAmount(Number(value)), '']}
              contentStyle={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-secondary)',
                borderRadius: 8,
                fontSize: 13,
              }}
           />
         </PieChart>
       </ResponsiveContainer>

       <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
         {categories.map((cat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: cat.color,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', flex: 1 }}>
              {cat.name}
            </span>
              <span style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 500 }}>
              {Math.round((cat.total / total) * 100)}%
            </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', minWidth: 60, textAlign: 'right' }}>
              {formatAmount(cat.total)}
            </span>
            </div>
         ))}
       </div>
     </div>
  )
}
