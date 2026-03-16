'use client'

import { useState } from 'react'
import { Transaction } from '@/types'
import styles from './transaction-list.module.scss';

interface Props {
  transactions: Transaction[]
  onDelete?: (id: string) => void
}

export default function TransactionList({ transactions, onDelete }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    await fetch('/api/transactions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    onDelete?.(id)
    setDeletingId(null)
  }

  return (
     <div className={styles.container}>
       <p className={styles.title}>
         Последние транзакции
       </p>

       <div className={styles.transactions_list}>
         {transactions.slice(0, 8).map(t => (
            <div
               key={t.id}
               className={styles.transaction_wrapper}
               onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-background-secondary)')}
               onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                 className={`${styles.transaction_type} 
                 ${t.type === 'income' 
                    ? styles.transaction_income 
                    : styles.transaction_expense}`
              }>
                {t.type === 'income' ? '↑' : '↓'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 500,
                  color: 'var(--color-text-primary)', marginBottom: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {t.description || t.category}
                </p>
                <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                  {t.category} · {new Date(t.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <span style={{
                fontSize: 14, fontWeight: 500, flexShrink: 0,
                color: t.type === 'income' ? 'var(--color-text-success)' : 'var(--color-text-danger)',
              }}>
              {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
            </span>
              <button
                 onClick={() => handleDelete(t.id)}
                 disabled={deletingId === t.id}
                 style={{
                   background: 'none', border: 'none', cursor: 'pointer',
                   color: 'var(--color-text-tertiary)', fontSize: 16,
                   padding: '0 4px', opacity: deletingId === t.id ? 0.4 : 1,
                 }}
              >
                ×
              </button>
            </div>
         ))}
       </div>
     </div>
  )
}
