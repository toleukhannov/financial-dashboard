import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data: transactions, error } = await supabase
     .from('transactions')
     .select('*')
     .order('date', { ascending: false })
     .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const summary = transactions.reduce(
     (acc, t) => {
       if (t.type === 'income') acc.income += t.amount
       else acc.expense += t.amount
       return acc
     },
     { income: 0, expense: 0 }
  )

  const prompt = `
Ты финансовый аналитик. Проанализируй транзакции пользователя и дай краткий анализ.

Общая статистика:
- Доходы: ${summary.income}
- Расходы: ${summary.expense}
- Баланс: ${summary.income - summary.expense}

Последние транзакции:
${transactions.slice(0, 20).map(t =>
     `${t.date} | ${t.type === 'income' ? '+' : '-'}${t.amount} | ${t.category} | ${t.description || ''}`
  ).join('\n')}

Ответь строго в JSON формате без markdown:
{
  "summary": "краткий общий вывод в 1-2 предложения",
  "alerts": ["предупреждение 1", "предупреждение 2"],
  "recommendations": ["рекомендация 1", "рекомендация 2", "рекомендация 3"]
}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  })

  const content = response.choices[0].message.content || '{}'

  try {
    const insight = JSON.parse(content)
    return NextResponse.json(insight)
  } catch {
    return NextResponse.json({
      summary: content,
      alerts: [],
      recommendations: [],
    })
  }
}

// POST — для чата, пользователь задаёт вопрос
export async function POST(req: NextRequest) {
  const { question } = await req.json()

  if (!question) {
    return NextResponse.json({ error: 'question is required' }, { status: 400 })
  }

  const { data: transactions } = await supabase
     .from('transactions')
     .select('*')
     .order('date', { ascending: false })
     .limit(50)

  const context = (transactions || []).map(t =>
     `${t.date} | ${t.type === 'income' ? '+' : '-'}${t.amount} | ${t.category} | ${t.description || ''}`
  ).join('\n')

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Ты финансовый помощник. Отвечай только на основе данных транзакций пользователя. Будь краток и конкретен.\n\nТранзакции:\n${context}`,
      },
      {
        role: 'user',
        content: question,
      },
    ],
    temperature: 0.5,
  })

  return NextResponse.json({
    answer: response.choices[0].message.content,
  })
}
