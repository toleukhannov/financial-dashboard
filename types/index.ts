export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  user_id: string
  amount: number
  category: string
  description: string | null
  date: string
  type: TransactionType
}

export interface AIInsight {
  summary: string
  alerts: string[]
  recommendations: string[]
}

export interface Category {
  name: string
  total: number
  color: string
}

export interface MonthlyData {
  month: string
  income: number
  expense: number
}

export interface DashboardStats {
  totalBalance: number
  totalIncome: number
  totalExpense: number
  savingsRate: number
}
