import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finca San Angel - Gestión Inteligente',
  description: 'Sistema administrativo y productivo para la Finca Lechera San Angel.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div className="main-container">
            <header className="site-header glass-panel">
              <div className="site-logo">
                <h1>Finca San Angel</h1>
                <span className="site-tagline">Gestión Inteligente</span>
              </div>
              <nav className="site-nav">
                <Link href="/" className="site-navLink">Dashboard</Link>
                <Link href="/ganado" className="site-navLink">Ganado</Link>
                <Link href="/leche" className="site-navLink">Lácteos</Link>
                <Link href="/finanzas" className="site-navLink">Finanzas</Link>
                <Link href="/inventario" className="site-navLink">Inventario</Link>
                <button className="btn-primary">Nueva Tarea</button>
              </nav>
            </header>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
