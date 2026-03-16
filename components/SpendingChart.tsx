'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { MonthlyData } from '@/types'

interface Props {
  data: MonthlyData[]
}

const MONTH_NAMES: Record<string, string> = {
  '01': 'Янв', '02': 'Фев', '03': 'Мар', '04': 'Апр',
  '05': 'Май', '06': 'Июн', '07': 'Июл', '08': 'Авг',
  '09': 'Сен', '10': 'Окт', '11': 'Ноя', '12': 'Дек',
}

function formatMonth(month: string) {
  const [, m] = month.split('-')
  return MONTH_NAMES[m] || month
}

function formatAmount(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
  return `$${value}`
}

interface TooltipProps {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null

  return (
     <div style={{
       background: 'var(--color-background-primary)',
       border: '0.5px solid var(--color-border-secondary)',
       borderRadius: 8,
       padding: '10px 14px',
       fontSize: 13,
     }}>
       <p style={{ color: 'var(--color-text-secondary)', marginBottom: 6, fontSize: 12 }}>
         {label}
       </p>
       {payload.map(entry => (
          <p key={entry.name} style={{ color: entry.color, margin: '2px 0', fontWeight: 500 }}>
            {entry.name === 'income' ? 'Доходы' : 'Расходы'}: {formatAmount(entry.value)}
          </p>
       ))}
       {payload.length === 2 && (
          <p style={{
            color: 'var(--color-text-secondary)',
            borderTop: '0.5px solid var(--color-border-tertiary)',
            marginTop: 6,
            paddingTop: 6,
            fontSize: 12,
          }}>
            Баланс: {formatAmount(payload[0].value - payload[1].value)}
          </p>
       )}
     </div>
  )
}

export default function SpendingChart({ data }: Props) {
  const formattedData = data.map(d => ({
    ...d,
    month: formatMonth(d.month),
  }))

  return (
     <div style={{
       background: 'var(--color-background-primary)',
       border: '0.5px solid var(--color-border-tertiary)',
       borderRadius: 12,
       padding: '20px 16px 12px',
     }}>
       <p style={{
         fontSize: 13,
         fontWeight: 500,
         color: 'var(--color-text-secondary)',
         marginBottom: 20,
       }}>
         Доходы и расходы
       </p>

       <ResponsiveContainer width="100%" height={220}>
         <LineChart data={formattedData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
           <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border-tertiary)"
              vertical={false}
           />
           <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }}
              axisLine={false}
              tickLine={false}
           />
           <YAxis
              tickFormatter={formatAmount}
              tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }}
              axisLine={false}
              tickLine={false}
              width={48}
           />
           <Tooltip content={<CustomTooltip />} />
           <Legend
              formatter={value => (
                 <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                {value === 'income' ? 'Доходы' : 'Расходы'}
              </span>
              )}
           />
           <Line
              type="monotone"
              dataKey="income"
              stroke="#1D9E75"
              strokeWidth={2}
              dot={{ r: 3, fill: '#1D9E75', strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
           />
           <Line
              type="monotone"
              dataKey="expense"
              stroke="#D85A30"
              strokeWidth={2}
              dot={{ r: 3, fill: '#D85A30', strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
           />
         </LineChart>
       </ResponsiveContainer>
     </div>
  )
}
