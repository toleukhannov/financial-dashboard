import { supabase } from '@/lib/supabase'
import { MonthlyData, Category, DashboardStats } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: transactions, error } = await supabase
     .from('transactions')
     .select('*')
     .eq('user_id', session.user.id)
     .order('date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Считаем статистику
  const stats: DashboardStats = {
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
    savingsRate: 0,
  }

  transactions.forEach(t => {
    if (t.type === 'income') stats.totalIncome += t.amount
    else stats.totalExpense += t.amount
  })

  stats.totalBalance = stats.totalIncome - stats.totalExpense
  stats.savingsRate = stats.totalIncome > 0
     ? Math.round((stats.totalBalance / stats.totalIncome) * 100)
     : 0

  // Группируем по месяцам для графика
  const monthlyMap = new Map<string, MonthlyData>()

  transactions.forEach(t => {
    const month = t.date.slice(0, 7) // "2024-03"
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { month, income: 0, expense: 0 })
    }
    const entry = monthlyMap.get(month)!
    if (t.type === 'income') entry.income += t.amount
    else entry.expense += t.amount
  })

  const monthly = Array.from(monthlyMap.values())
     .sort((a, b) => a.month.localeCompare(b.month))
     .slice(-6) // последние 6 месяцев

  // Группируем по категориям
  const categoryMap = new Map<string, number>()

  transactions
     .filter(t => t.type === 'expense')
     .forEach(t => {
       categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount)
     })

  const COLORS = ['#1D9E75', '#7F77DD', '#D85A30', '#378ADD', '#BA7517', '#D4537E']

  const categories: Category[] = Array.from(categoryMap.entries())
     .map(([name, total], i) => ({
       name,
       total,
       color: COLORS[i % COLORS.length],
     }))
     .sort((a, b) => b.total - a.total)

  return NextResponse.json({ transactions, stats, monthly, categories })
}



export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const { data: transaction, error } = await supabase
     .from('transactions')
     .insert({
       ...body,
       user_id: session.user.id,
     })
     .select()
     .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ transaction })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()

  const { error } = await supabase
     .from('transactions')
     .delete()
     .eq('id', id)
     .eq('user_id', session.user.id) // защита — удалять только свои

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
