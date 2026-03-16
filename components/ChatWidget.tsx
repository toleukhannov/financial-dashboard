'use client'

import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Привет! Задай вопрос по своим финансам — например, сколько потратил на еду за последний месяц.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    const question = input.trim()
    if (!question || loading) return

    setMessages(prev => [...prev, { role: 'user', text: question }])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    })

    const data = await res.json()
    setMessages(prev => [...prev, {
      role: 'assistant',
      text: data.answer || 'Не удалось получить ответ',
    }])
    setLoading(false)
  }

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
       <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)' }}>
         Чат с данными
       </p>

       <div style={{
         display: 'flex',
         flexDirection: 'column',
         gap: 8,
         minHeight: 160,
         maxHeight: 260,
         overflowY: 'auto',
       }}>
         {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 13,
                lineHeight: 1.5,
                background: msg.role === 'user'
                   ? '#EEEDFE'
                   : 'var(--color-background-secondary)',
                color: msg.role === 'user'
                   ? '#3C3489'
                   : 'var(--color-text-primary)',
              }}>
                {msg.text}
              </div>
            </div>
         ))}
         {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 13,
                background: 'var(--color-background-secondary)',
                color: 'var(--color-text-tertiary)',
              }}>
                Думаю...
              </div>
            </div>
         )}
       </div>

       <div style={{ display: 'flex', gap: 8 }}>
         <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Задай вопрос..."
            style={{ flex: 1, fontSize: 13 }}
         />
         <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ fontSize: 13, padding: '0 16px' }}
         >
           →
         </button>
       </div>
     </div>
  )
}
