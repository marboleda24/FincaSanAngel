import { registrarNuevoItem } from '@/app/actions/inventario'
import Link from 'next/link'

export default function NuevoItemBodega() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/inventario" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontWeight: 500 }}>
          &larr; Volver a Bodega
        </Link>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Catalogar Nuevo Insumo</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Agrega un ítem inédito al maestro para poder realizarle entradas y salidas a futuro.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <form action={registrarNuevoItem}>
          
          <div className="form-group">
            <label htmlFor="nombreItem">Nombre Comercial del Producto / Insumo *</label>
            <input type="text" id="nombreItem" name="nombreItem" required placeholder="Ej. Concentrado Vacas Lecheras Purina" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="form-group">
              <label htmlFor="unidadMedida">Unidad Logística (Medida) *</label>
              <select id="unidadMedida" name="unidadMedida" required>
                <option value="Bultos">Bultos</option>
                <option value="Kilos">Kilos (kg)</option>
                <option value="Litros">Litros (Lt)</option>
                <option value="Dosis">Dosis / Jeringas</option>
                <option value="Unidades">Unidades estándar</option>
                <option value="Metros">Metros (mts)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="cantidadInicial">Existencia / Saldo Inicial Físico *</label>
              <input type="number" step="0.01" min="0" id="cantidadInicial" name="cantidadInicial" required placeholder="Ej. 10" defaultValue="0" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comentarios">Comentarios o Especificaciones (Opcional)</label>
            <textarea id="comentarios" name="comentarios" rows={3} placeholder="Proveedor sugerido, uso habitual..."></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Guardar en Maestro</button>
          </div>

        </form>
      </div>
    </div>
  )
}
