import { getInventarioGlobal, registrarMovimientoKardex } from '@/app/actions/inventario'
import Link from 'next/link'

export default async function MovimientoBodegaForm() {
  const { data: inventario, success } = await getInventarioGlobal()
  const fechaDeHoyLoc = new Date().toISOString().slice(0, 16) // Preparado para datetime-local

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/inventario" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontWeight: 500 }}>
          &larr; Abortar Captura
        </Link>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Nuevo Movimiento de Kardex</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Añade reservas (Entrada) o reporta insumos gastados (Salidas). El saldo se actualizará matemáticamente en la bóveda principal.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {!success || inventario.length === 0 ? (
           <div style={{ textAlign: 'center' }}>
             <p style={{ color: 'var(--text-primary)' }}>Para hacer movimientos de caja primero necesitas un elemento listado.</p>
             <Link href="/inventario/nuevo" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Ir a Catalogar Nuevo Ítem</Link>
           </div>
        ) : (
          <form action={registrarMovimientoKardex}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              <div className="form-group">
                <label htmlFor="inventarioId">Artículo / Insumo *</label>
                <select id="inventarioId" name="inventarioId" required>
                  <option value="">Selecciona el producto a afectar...</option>
                  {inventario.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.nombreItem} - [Saldo Actual: {Number(item.cantidadDisponible)} {item.unidadMedida}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Naturaleza Operativa *</label>
                <select id="tipo" name="tipo" required>
                  <option value="Salida">SALIDA (Consumo)</option>
                  <option value="Entrada">ENTRADA (Recarga)</option>
                  <option value="Ajuste">AJUSTE (Pérdida/Conteo)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="form-group">
                <label htmlFor="cantidad">Lote a afectar (Fracción/Decimal) *</label>
                {/* 
                  * Si es entrada suma, si es Salida resta. 
                  * Si es 'Ajuste', este número exacto REEMPLAZARÁ el saldo actual de bodega ciegamente. 
                */}
                <input type="number" step="0.01" min="0" id="cantidad" name="cantidad" required placeholder="Ej. 5.5" />
              </div>
              <div className="form-group">
                <label htmlFor="fecha">Fecha y Hora Probada *</label>
                <input type="datetime-local" id="fecha" name="fecha" required defaultValue={fechaDeHoyLoc} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="justificacion">Justificación Auditable *</label>
              <input type="text" id="justificacion" name="justificacion" required placeholder="Ej. Se usaron 2 bultos mezclados en el lote 4. / Llegó pedido factura #003" />
            </div>

            <div className="form-group">
              <label htmlFor="comentarios">Anotaciones Opcionales</label>
              <textarea id="comentarios" name="comentarios" rows={2} placeholder="Novedades, estados alterados o quién reporta el bache."></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.05rem', backgroundColor: 'var(--accent-primary)' }}>
                Asentar Traslado
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}
