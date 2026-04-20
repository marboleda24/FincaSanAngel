import { getProduccionReciente } from '@/app/actions/leche'
import Link from 'next/link'

export default async function LecheDashboardView() {
  const { data: producciones, success } = await getProduccionReciente()

  // Calcular litros de leche de los registros mostrados
  const totalReciente = producciones?.reduce((sum, p) => sum + Number(p.litros), 0) || 0

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Módulo Lácteo</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Historial de litros ordeñados y control por turnos.</p>
        </div>
        <Link href="/leche/registro-lote" className="btn-primary" style={{ display: 'inline-block' }}>
          + Registrar Lote Diario
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Últimas Entradas (Registros mostrados)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalReciente} Lt</p>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Identificador Res</th>
              <th>Litros</th>
              <th>Comentarios del Lote</th>
            </tr>
          </thead>
          <tbody>
            {!success || producciones.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Aún no has registrado ningún lote de ordeño.
                </td>
              </tr>
            ) : (
              producciones.map((p) => (
                <tr key={p.id}>
                  <td>{new Date(p.fechaOrdeno).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${p.turno === 'Manana' ? 'active' : ''}`} style={{ backgroundColor: p.turno === 'Manana' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(251, 146, 60, 0.1)', color: p.turno === 'Manana' ? '#0284c7' : '#ea580c' }}>
                      {p.turno}
                    </span>
                  </td>
                  <td><strong>{p.bovino.identificador}</strong></td>
                  <td style={{ color: 'var(--info)', fontWeight: 600 }}>{Number(p.litros)} L</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.comentarios || 'Sin novedad'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
