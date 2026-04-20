import { getBovinoById } from '@/app/actions/bovinos'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function HojaDeVidaRes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: bovino, success } = await getBovinoById(id)

  if (!success || !bovino) {
    notFound()
  }

  const edad = new Date().getFullYear() - new Date(bovino.fechaNacimiento).getFullYear()

  // Calcular la producción total de la leche cargada en su historial
  const produccionTotal = bovino.produccionLeche.reduce((total, p) => total + Number(p.litros), 0)

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/ganado" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontWeight: 500 }}>
          &larr; Volver al inventario
        </Link>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Hoja de Vida</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Perfil integral y rendimiento histórico de esta unidad.</p>
      </div>

      <div className="profile-grid">
        {/* Columna Izquierda: Información Estática y Foto */}
        <aside className="glass-panel profile-card">
          <div className="profile-avatar">
             🐮
          </div>
          <h2 style={{ textAlign: 'center', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            ID: {bovino.identificador}
          </h2>

          <div className="data-group">
            <span className="data-label">Estado</span>
            <span className={`badge ${bovino.estado === 'Activo' ? 'active' : ''}`}>{bovino.estado}</span>
          </div>
          <div className="data-group">
            <span className="data-label">Raza</span>
            <span className="data-value">{bovino.raza}</span>
          </div>
          <div className="data-group">
            <span className="data-label">Género</span>
            <span className="data-value">{bovino.genero}</span>
          </div>
          <div className="data-group">
            <span className="data-label">Nacimiento</span>
            <span className="data-value">{new Date(bovino.fechaNacimiento).toLocaleDateString()}</span>
          </div>
          <div className="data-group">
            <span className="data-label">Edad Aproximada</span>
            <span className="data-value">{edad === 0 ? 'Menos de 1 año' : `${edad} años`}</span>
          </div>

          {bovino.comentarios && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
              <span className="data-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Comentarios</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{bovino.comentarios}</p>
            </div>
          )}
        </aside>

        {/* Columna Derecha: Lácteos y Clínicos */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Tarjeta de Producción Lechera */}
          <section className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <h3 style={{ color: 'var(--accent-primary)' }}>Rendimiento Lechero</h3>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{bovino.produccionLeche.length} controles</span>
            </div>
            
            {bovino.genero === 'Macho' ? (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>El módulo lácteo no aplica para reses macho.</p>
            ) : bovino.produccionLeche.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No hay ordeños registrados para {bovino.identificador} aún.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Nota: Los ordeños se registran desde el módulo de control lechero unificado.</p>
              </div>
            ) : (
              <div>
                <p style={{ marginBottom: '1rem', fontWeight: 600 }}>Producción Histórica Total: <span style={{ color: 'var(--info)' }}>{produccionTotal} Lt</span></p>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Turno</th>
                        <th>Litros</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bovino.produccionLeche.slice(0, 5).map(p => (
                        <tr key={p.id}>
                          <td>{new Date(p.fechaOrdeno).toLocaleDateString()}</td>
                          <td>{p.turno}</td>
                          <td><strong>{Number(p.litros)} L</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* Tarjeta de Eventos Veterinarios */}
          <section className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <h3 style={{ color: 'var(--warning)' }}>Historial Clínico y Trazabilidad</h3>
              <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>+ Añadir Tarea Médica</button>
            </div>

            {bovino.eventosMedicos.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Esta res no presenta incidencias médicas programadas ni en el historial.</p>
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {bovino.eventosMedicos.map(evento => (
                  <li key={evento.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dotted var(--border-subtle)' }}>
                     <div>
                       <span style={{ fontWeight: 600, display: 'block', color: 'var(--text-primary)' }}>{evento.tipo}</span>
                       <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{evento.diagnosticoDescripcion}</span>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                       <span style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-secondary)' }}>
                         Prog: {new Date(evento.fechaProgramada).toLocaleDateString()}
                       </span>
                       <span className={`badge ${evento.fechaEjecucion ? 'active' : ''}`} style={{ marginTop: '0.2rem' }}>
                         {evento.fechaEjecucion ? 'Completado' : 'Pendiente'}
                       </span>
                     </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

        </main>
      </div>
    </div>
  )
}
