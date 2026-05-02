import { getHembrasActivas, registrarLoteOrdeno } from '@/app/actions/leche'
import Link from 'next/link'

export default async function RegistroLoteOrdeno() {
  const { data: hembras, success } = await getHembrasActivas()

  const fechaDeHoy = new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/leche" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontWeight: 500 }}>
          &larr; Cancelar jornada
        </Link>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Registrar Lote de Ordeño</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Rellena la lista de las vacas activas. Deja en blanco aquellas que no hayan producido o sido ordeñadas hoy.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <form action={async (formData) => {
          'use server'
          await registrarLoteOrdeno(formData)
        }}>
          
          {/* Cabecera del Lote */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="fechaOrdeno">Fecha de Ordeño *</label>
              <input type="date" id="fechaOrdeno" name="fechaOrdeno" required defaultValue={fechaDeHoy} />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="turno">Turno *</label>
              <select id="turno" name="turno" required>
                <option value="Manana">Mañana</option>
                <option value="Tarde">Tarde</option>
              </select>
            </div>
          </div>

          {!success || hembras.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '1.1rem' }}>No hay vacas hembras habilitadas en el inventario.</p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Por favor, dirígete al módulo de Ganado y registra o cambia el estado de los animales a Activo.</p>
            </div>
          ) : (
            <>
              {/* Lista Pre-cargada Dinámica */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Listado de Vaciado ({hembras.length} vacas)</h3>
                
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Chapeta / Identificador</th>
                        <th style={{ width: '30%' }}>Raza</th>
                        <th style={{ width: '30%' }}>Litros (Decimal)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hembras.map((vaca) => (
                        <tr key={vaca.id}>
                          <td><strong>{vaca.identificador}</strong></td>
                          <td><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{vaca.raza}</span></td>
                          <td>
                            <input 
                              type="number" 
                              step="0.1" 
                              min="0"
                              name={`litros_${vaca.id}`} 
                              placeholder="Ej. 14.5"
                              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--accent-primary)' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pie del Formulario y Transacciones */}
              <div className="form-group">
                <label htmlFor="comentarios">Comentarios Locales del Ordeño</label>
                <textarea id="comentarios" name="comentarios" rows={3} placeholder="Novedades de la jornada, interrupciones, clima..."></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.05rem' }}>Guardar Lote de Ordeño</button>
              </div>
            </>
          )}

        </form>
      </div>
    </div>
  )
}
