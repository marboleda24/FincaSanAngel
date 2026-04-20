import { getInventarioGlobal, getHistorialMovimientos } from '@/app/actions/inventario'
import Link from 'next/link'

export default async function InventarioDashboard() {
  const { data: inventario, success: successInv } = await getInventarioGlobal()
  const { data: historial, success: successHist } = await getHistorialMovimientos()

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Bodega y Cuentas Físicas</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Logística de insumos, entradas a granero y descargas operativas.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/inventario/movimiento" className="btn-primary" style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
            + Registrar Entrada/Salida
          </Link>
          <Link href="/inventario/nuevo" className="btn-primary" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
            + Catalogar Nuevo Insumo
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr)', gap: '2rem' }}>
        
        {/* Tabla Princial de Stock */}
        <section>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Existencias Actuales</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Insumo / Elemento</th>
                  <th style={{ textAlign: 'center' }}>Cantidad Física Disponible</th>
                  <th>Unidad Operativa</th>
                </tr>
              </thead>
              <tbody>
                {!successInv || inventario?.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      El catálogo de bodega está vacío. Comienza catalogando un insumo.
                    </td>
                  </tr>
                ) : (
                  inventario?.map((item) => (
                    <tr key={item.id}>
                      <td><strong style={{ color: 'var(--text-primary)' }}>{item.nombreItem}</strong></td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ 
                          fontSize: '1.1rem', 
                          fontWeight: 700, 
                          color: Number(item.cantidadDisponible) < 5 ? 'var(--error)' : 'var(--text-primary)' 
                         }}>
                          {Number(item.cantidadDisponible)}
                        </span>
                        {Number(item.cantidadDisponible) < 5 && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--error)' }}>¡Bajo Stock!</span>}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.unidadMedida}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tabla de Historial (Kardex) */}
        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Bitácora de Kardex (Últimos Movimientos)</h2>
          <div className="table-container" style={{ opacity: 0.9 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Tipo Operación</th>
                  <th>Ítem Bodega</th>
                  <th>Impacto / Lote</th>
                  <th>Justificación</th>
                </tr>
              </thead>
              <tbody>
                {!successHist || historial?.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Aún no hay descargas ni entradas reportadas en el kardex histórico.
                    </td>
                  </tr>
                ) : (
                  historial?.map((mov) => (
                    <tr key={mov.id}>
                      <td style={{ fontSize: '0.85rem' }}>{new Date(mov.fecha).toLocaleString()}</td>
                      <td>
                        <span className="badge" style={{ 
                          backgroundColor: mov.tipo === 'Entrada' ? 'rgba(34, 197, 94, 0.1)' : mov.tipo === 'Salida' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                          color: mov.tipo === 'Entrada' ? 'var(--success)' : mov.tipo === 'Salida' ? 'var(--error)' : 'var(--warning)'
                        }}>
                          {mov.tipo}
                        </span>
                      </td>
                      <td><strong>{mov.inventario.nombreItem}</strong></td>
                      <td style={{ 
                          fontWeight: 600, 
                          color: mov.tipo === 'Entrada' ? 'var(--success)' : mov.tipo === 'Salida' ? 'var(--error)' : 'var(--warning)'
                      }}>
                        {mov.tipo === 'Salida' ? '-' : ''}{mov.tipo === 'Ajuste' ? '=' : ''}{Number(mov.cantidad)} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{mov.inventario.unidadMedida}</span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{mov.justificacion || '--'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}
