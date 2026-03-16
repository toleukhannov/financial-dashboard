'use client'

import { useState, useEffect } from 'react'
import { AIInsight } from '@/types'

export default function AIInsights() {
  const [insight, setInsight] = useState<AIInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/ai')
       .then(res => res.json())
       .then(data => {
         setInsight(data)
         setLoading(false)
       })
       .catch(() => {
         setError('Не удалось загрузить инсайты')
         setLoading(false)
       })
  }, [])

  if (loading) return (
     <div style={{
       background: 'var(--color-background-primary)',
       border: '0.5px solid var(--color-border-tertiary)',
       borderRadius: 12,
       padding: '20px 16px',
     }}>
       <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
         AI анализирует данные...
       </p>
     </div>
  )

  if (error || !insight) return null

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
         marginBottom: 14,
       }}>
         AI инсайты
       </p>

       <div style={{
         background: '#EEEDFE',
         borderRadius: 8,
         padding: '12px 14px',
         marginBottom: 12,
       }}>
         <p style={{ fontSize: 13, color: '#3C3489', lineHeight: 1.6 }}>
           {insight.summary}
         </p>
       </div>

       {insight.alerts.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-danger)', marginBottom: 6 }}>
              Предупреждения
            </p>
            {insight.alerts.map((alert, i) => (
               <div key={i} style={{
                 fontSize: 13,
                 color: 'var(--color-text-secondary)',
                 padding: '6px 0',
                 borderBottom: i < insight.alerts.length - 1
                    ? '0.5px solid var(--color-border-tertiary)'
                    : 'none',
                 lineHeight: 1.5,
               }}>
                 · {alert}
               </div>
            ))}
          </div>
       )}

       {insight.recommendations.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-success)', marginBottom: 6 }}>
              Рекомендации
            </p>
            {insight.recommendations.map((rec, i) => (
               <div key={i} style={{
                 fontSize: 13,
                 color: 'var(--color-text-secondary)',
                 padding: '6px 0',
                 borderBottom: i < insight.recommendations.length - 1
                    ? '0.5px solid var(--color-border-tertiary)'
                    : 'none',
                 lineHeight: 1.5,
               }}>
                 · {rec}
               </div>
            ))}
          </div>
       )}
     </div>
  )
}
