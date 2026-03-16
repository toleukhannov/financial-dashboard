'use client'

import { useState } from 'react'
import { Transaction } from '@/types'

interface Props {
  onAdd: (transaction: Transaction) => void
  userId: string
}

const CATEGORIES = ['Еда', 'Транспорт', 'Жильё', 'Развлечения', 'Здоровье', 'Зарплата', 'Другое']

export default function TransactionForm({ onAdd, userId }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    category: 'Еда',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'expense' as 'income' | 'expense',
  })

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.amount || isNaN(Number(form.amount))) return
    setLoading(true)

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        user_id: userId,
      }),
    })

    const data = await res.json()
    if (data.transaction) {
      onAdd(data.transaction)
      setForm({
        amount: '',
        category: 'Еда',
        description: '',
        date: new Date().toISOString().slice(0, 10),
        type: 'expense',
      })
      setOpen(false)
    }
    setLoading(false)
  }

  if (!open) return (
     <button
        onClick={() => setOpen(true)}
        style={{
          fontSize: 13,
          padding: '8px 16px',
          borderRadius: 8,
          border: '0.5px solid var(--color-border-secondary)',
          background: 'transparent',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
        }}
     >
       + Добавить транзакцию
     </button>
  )

  return (
     <div style={{
       background: 'var(--color-background-primary)',
       border: '0.5px solid var(--color-border-tertiary)',
       borderRadius: 12,
       padding: '20px 16px',
       display: 'flex',
       flexDirection: 'column',
       gap: 12,
     }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)' }}>
           Новая транзакция
         </p>
         <button
            onClick={() => setOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              color: 'var(--color-text-tertiary)',
              padding: '0 4px',
            }}
         >
           ×
         </button>
       </div>

       {/* Тип */}
       <div style={{ display: 'flex', gap: 6 }}>
         {(['expense', 'income'] as const).map(t => (
            <button
               key={t}
               onClick={() => set('type', t)}
               style={{
                 flex: 1,
                 padding: '7px 0',
                 fontSize: 13,
                 borderRadius: 8,
                 cursor: 'pointer',
                 border: '0.5px solid',
                 borderColor: form.type === t
                    ? t === 'income' ? '#1D9E75' : '#D85A30'
                    : 'var(--color-border-tertiary)',
                 background: form.type === t
                    ? t === 'income' ? '#E1F5EE' : '#FAECE7'
                    : 'transparent',
                 color: form.type === t
                    ? t === 'income' ? '#0F6E56' : '#993C1D'
                    : 'var(--color-text-secondary)',
                 fontWeight: form.type === t ? 500 : 400,
               }}
            >
              {t === 'income' ? 'Доход' : 'Расход'}
            </button>
         ))}
       </div>

       {/* Сумма */}
       <input
          type="number"
          placeholder="Сумма"
          value={form.amount}
          onChange={e => set('amount', e.target.value)}
          style={{ fontSize: 13 }}
       />

       {/* Категория */}
       <select
          value={form.category}
          onChange={e => set('category', e.target.value)}
          style={{ fontSize: 13 }}
       >
         {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
         ))}
       </select>

       {/* Описание */}
       <input
          type="text"
          placeholder="Описание (необязательно)"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          style={{ fontSize: 13 }}
       />

       {/* Дата */}
       <input
          type="date"
          value={form.date}
          onChange={e => set('date', e.target.value)}
          style={{ fontSize: 13 }}
       />

       <button
          onClick={handleSubmit}
          disabled={loading || !form.amount}
          style={{
            fontSize: 13,
            padding: '9px 0',
            borderRadius: 8,
            border: 'none',
            background: '#1D9E75',
            color: '#fff',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
       >
         {loading ? 'Сохраняю...' : 'Сохранить'}
       </button>
     </div>
  )
}
