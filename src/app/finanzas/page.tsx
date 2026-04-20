import { getFinanzasDashboard } from '@/app/actions/finanzas'
import Link from 'next/link'

// Formateador de moneda en Pesos/Dólares según locale
const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor)
}

export default async function FinanzasDashboard() {
  const { data: transacciones, stats, success } = await getFinanzasDashboard()

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Dashboard Financiero</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Control de caja, ingresos operativos y gastos corrientes.</p>
        </div>
        <Link href="/finanzas/nueva" className="btn-primary" style={{ display: 'inline-block' }}>
          + Ingresar Movimiento
        </Link>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--info)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Ingresos (Histórico)</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatearMoneda(stats.totalIngresos)}</p>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Gastos (Histórico)</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatearMoneda(stats.totalGastos)}</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${stats.balanceNeto >= 0 ? "var(--success)" : "var(--error)"}` }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Balance / Caja Neta</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 700, color: stats.balanceNeto >= 0 ? 'var(--success)' : 'var(--error)' }}>
            {formatearMoneda(stats.balanceNeto)}
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Últimas Transacciones</h2>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th style={{ textAlign: 'right' }}>Monto</th>
            </tr>
          </thead>
          <tbody>
            {!success || transacciones.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Aún no existen movimientos financieros en caja.
                </td>
              </tr>
            ) : (
              transacciones.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.fecha).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${tx.tipo === 'Ingreso' ? 'active' : ''}`} style={tx.tipo === 'Gasto' ? { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' } : {}}>
                      {tx.tipo}
                    </span>
                  </td>
                  <td><span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{tx.categoria}</span></td>
                  <td>{tx.descripcion || '--'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: tx.tipo === 'Ingreso' ? 'var(--success)' : 'var(--error)' }}>
                    {tx.tipo === 'Ingreso' ? '+' : '-'} {formatearMoneda(Number(tx.monto))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
