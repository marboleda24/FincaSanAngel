import { getMetricasDashboard } from '@/app/actions/dashboard'
import Link from 'next/link'

// Formateador de moneda para el panel rápido
const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor)
}

export default async function Home() {
  const { data: metricas } = await getMetricasDashboard()

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginTop: '2rem' }}>Resumen Finca San Angel</h1>
      
      {/* Sección Superior: KPIs (Cards Glassmorphism) */}
      <section className="dashboard-grid">
        <div className="glass-panel stat-card">
          <h3 className="stat-label">Total Ganado Activo</h3>
          <p className="stat-value" style={{ color: 'var(--accent-primary)' }}>{metricas?.ganadoActivo || 0} Cabezas</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Hembras y Machos Vitales</p>
        </div>

        <div className="glass-panel stat-card">
          <h3 className="stat-label">Balance Financiero</h3>
          <p className="stat-value" style={{ color: metricas?.balanceGeneral! >= 0 ? "var(--success)" : "var(--error)" }}>
            {formatearMoneda(metricas?.balanceGeneral || 0)}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Diferencia Ingresos Neta</p>
        </div>

        <div className="glass-panel stat-card">
          <h3 className="stat-label">Stock en Bodega Pura</h3>
          <p className="stat-value" style={{ color: metricas?.alertasBodega! > 0 ? 'var(--error)' : 'var(--text-primary)' }}>
            {metricas?.alertasBodega || 0} Insumos Críticos
          </p>
          {metricas?.alertasBodega! > 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--error)', marginTop: '0.5rem' }}>Requiere tu atención inmediata.</p>
          )}
        </div>
      </section>

      {/* Sección Inferior: Módulos y Tareas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Lácteos Resumen Rápido */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Producción Módulo Lácteo</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Se han guardado históricamente <strong>{metricas?.conteoOrdenos || 0}</strong> lotes de ordeño y descargas productivas asociadas en la central de leche.</p>
          <Link href="/leche" className="btn-primary">
            Ingresar al Lote Diario
          </Link>
        </section>

        {/* Tareas Pendientes (Módulo Placeholder para v2) */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
             <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Tareas Pendientes</h2>
             <span className="badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--warning)' }}>Próximamente</span>
           </div>
           
           <div style={{ padding: '3rem 1rem', textAlign: 'center', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
             <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem', color: 'var(--accent-primary)' }}>🚧</span>
             <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Gestor Administrativo de Asignaciones (V2)</h4>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                En la futura gran actualización activaremos esta suite de calendarios y tareas operativas para ti y tus empleados. 
                De momento, disfruta el flujo completo Ganadero y Financiero.
             </p>
           </div>
        </section>

      </div>
    </div>
  )
}
