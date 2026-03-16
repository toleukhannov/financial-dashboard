import { DashboardStats } from '@/types'

interface Props {
  stats: DashboardStats
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

interface CardProps {
  label: string
  value: string
  delta?: string
  positive?: boolean
}

function MetricCard({ label, value, delta, positive }: CardProps) {
  return (
     <div style={{
       background: 'var(--color-background-secondary)',
       borderRadius: 8,
       padding: '14px 16px',
     }}>
       <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
         {label}
       </p>
       <p style={{ fontSize: 22, fontWeight: 500, color: 'var(--color-text-primary)' }}>
         {value}
       </p>
       {delta && (
          <p style={{
            fontSize: 12,
            marginTop: 2,
            color: positive
               ? 'var(--color-text-success)'
               : 'var(--color-text-danger)',
          }}>
            {delta}
          </p>
       )}
     </div>
  )
}

export default function MetricCards({ stats }: Props) {
  return (
     <div style={{
       display: 'grid',
       gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
       gap: 10,
     }}>
       <MetricCard
          label="Баланс"
          value={formatAmount(stats.totalBalance)}
          delta={stats.totalBalance >= 0 ? 'Положительный' : 'Отрицательный'}
          positive={stats.totalBalance >= 0}
       />
       <MetricCard
          label="Доходы"
          value={formatAmount(stats.totalIncome)}
          delta="За все время"
          positive
       />
       <MetricCard
          label="Расходы"
          value={formatAmount(stats.totalExpense)}
          delta="За все время"
          positive={false}
       />
       <MetricCard
          label="Норма сбережений"
          value={`${stats.savingsRate}%`}
          delta={stats.savingsRate >= 20 ? 'Хороший показатель' : 'Можно лучше'}
          positive={stats.savingsRate >= 20}
       />
     </div>
  )
}
