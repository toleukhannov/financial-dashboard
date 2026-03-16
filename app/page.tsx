'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Transaction, DashboardStats, MonthlyData, Category } from '@/types'
import MetricCards from '@/components/MetricCards'
import SpendingChart from '@/components/SpendingChart'
import CategoryBreakdown from '@/components/CategoryBreakdown'
import TransactionList from '@/components/TransactionList'
import TransactionForm from '@/components/TransactionForm'
import AIInsights from '@/components/AIInsights'
import ChatWidget from '@/components/ChatWidget'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthly, setMonthly] = useState<MonthlyData[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  async function fetchData() {
    const res = await fetch('/api/transactions')
    const data = await res.json()
    setTransactions(data.transactions)
    setStats(data.stats)
    setMonthly(data.monthly)
    setCategories(data.categories)
  }

  const shouldFetch = status === 'authenticated'

  const [hasFetched, setHasFetched] = useState(false)

  if (shouldFetch && !hasFetched) {
    setHasFetched(true)
    fetchData()
  }

  function handleAdd(transaction: Transaction) {
    setTransactions(prev => [transaction, ...prev])
    fetchData() // обновляем статистику
  }

  function handleDelete(id: string) {
    setTransactions(prev => prev.filter(t => t.id !== id))
    fetchData()
  }

  if (status === 'loading' || !stats) {
    return (
       <div style={{ padding: 32, color: 'var(--color-text-secondary)', fontSize: 14 }}>
         Загрузка...
       </div>
    )
  }

  return (
     <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-sans)' }}>

       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
         <div>
           <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 4 }}>
             Financial Dashboard
           </h1>
           <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
             {session?.user?.name}
           </p>
         </div>
         <TransactionForm onAdd={handleAdd} userId={session!.user.id} />
       </div>

       <MetricCards stats={stats} />

       <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 14, marginTop: 14 }}>
         <SpendingChart data={monthly} />
         <CategoryBreakdown categories={categories} />
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 14, marginTop: 14 }}>
         <AIInsights />
         <ChatWidget />
       </div>

       <div style={{ marginTop: 14 }}>
         <TransactionList transactions={transactions} onDelete={handleDelete} />
       </div>

     </main>
  )
}
