import { registrarBovino } from '@/app/actions/bovinos'
import Link from 'next/link'

export default function NuevoBovinoForm() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/ganado" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontWeight: 500 }}>
          &larr; Volver al listado
        </Link>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Registrar Nueva Res</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Añade un nuevo individuo al rebaño de la Finca San Angel.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form action={async (formData) => {
          'use server'
          await registrarBovino(formData)
        }}>
          
          <div className="form-group">
            <label htmlFor="identificador">Chapeta / Identificador Único *</label>
            <input type="text" id="identificador" name="identificador" required placeholder="Ej. Lolo-042" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label htmlFor="genero">Género *</label>
              <select id="genero" name="genero" required>
                <option value="Hembra">Hembra</option>
                <option value="Macho">Macho</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento *</label>
              <input type="date" id="fechaNacimiento" name="fechaNacimiento" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="raza">Raza *</label>
            <input type="text" id="raza" name="raza" required placeholder="Ej. Holstein, Jersey, Angus" />
          </div>

          <div className="form-group">
            <label htmlFor="comentarios">Comentarios Adicionales</label>
            <textarea id="comentarios" name="comentarios" rows={4} placeholder="Detalles de procedencia, peculiaridades..."></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Guardar Res</button>
          </div>

        </form>
      </div>
    </div>
  )
}
