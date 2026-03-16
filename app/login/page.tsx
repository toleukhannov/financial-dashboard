'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
     <div style={{
       minHeight: '100vh',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       background: 'var(--color-background-tertiary)',
     }}>
       <div style={{
         background: 'var(--color-background-primary)',
         border: '0.5px solid var(--color-border-tertiary)',
         borderRadius: 16,
         padding: '40px 48px',
         textAlign: 'center',
         maxWidth: 360,
         width: '100%',
       }}>
         <h1 style={{
           fontSize: 20,
           fontWeight: 500,
           color: 'var(--color-text-primary)',
           marginBottom: 8,
         }}>
           Financial Dashboard
         </h1>
         <p style={{
           fontSize: 14,
           color: 'var(--color-text-secondary)',
           marginBottom: 32,
         }}>
           Войди чтобы увидеть свои финансы
         </p>
         <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            style={{
              width: '100%',
              padding: '10px 0',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              border: '0.5px solid var(--color-border-secondary)',
              background: 'transparent',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
         >
           Войти через Google
         </button>
       </div>
     </div>
  )
}
