'use client'

import { useState } from 'react'
import { registrarTransaccion } from '@/app/actions/finanzas'
import Link from 'next/link'

export const categoriasGasto = [
  'Alimento y Concentrado',
  'Insumos Veterinarios',
  'Servicios Médicos',
  'Nómina y Jornales',
  'Mantenimiento Finca',
  'Transporte y Fletes',
  'Servicios Públicos',
  'Compra de Animales',
  'Otros Gastos'
]

export const categoriasIngreso = [
  'Venta de Leche',
  'Venta de Ganado/Carne',
  'Venta de Crías',
  'Subsidios',
  'Otros Ingresos'
]


export default function NuevaTransaccionForm() {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'Ingreso' | 'Gasto'>('Gasto')
  const [usaOtraCategoria, setUsaOtraCategoria] = useState(false)
  
  const categoriasActuales = tipoSeleccionado === 'Ingreso' ? categoriasIngreso : categoriasGasto
  const fechaDeHoy = new Date().toISOString().split('T')[0]

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/finanzas" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontWeight: 500 }}>
          &larr; Volver al balance
        </Link>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Registrar Movimiento</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Asienta un ingreso de dinero o un pago por insumos operacionales.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <form action={async (formData) => { await registrarTransaccion(formData) }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="form-group">
              <label htmlFor="tipo">Naturaleza de Transacción *</label>
              <select 
                id="tipo" 
                name="tipo" 
                required 
                value={tipoSeleccionado}
                onChange={(e) => {
                  setTipoSeleccionado(e.target.value as 'Ingreso' | 'Gasto')
                  setUsaOtraCategoria(false)
                }}
              >
                <option value="Gasto">Gasto / Salida</option>
                <option value="Ingreso">Ingreso / Entrada</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="fecha">Fecha Efectiva *</label>
              <input type="date" id="fecha" name="fecha" required defaultValue={fechaDeHoy} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="form-group">
              <label htmlFor="monto">Monto (Valor Total) *</label>
              <input type="number" step="0.01" min="0" id="monto" name="monto" required placeholder="Ej. 150000" />
            </div>

            <div className="form-group">
               <label htmlFor="categoria">Categoría *</label>
               {!usaOtraCategoria ? (
                 <select 
                    id="categoria" 
                    name="categoria" 
                    required 
                    onChange={(e) => {
                      if (e.target.value === 'OTRA_NUEVA') {
                        setUsaOtraCategoria(true)
                      }
                    }}
                 >
                   {categoriasActuales.map(cat => (
                     <option key={cat} value={cat}>{cat}</option>
                   ))}
                   <option value="OTRA_NUEVA" style={{ fontWeight: 'bold' }}>+ Escribir Otra Diferente...</option>
                 </select>
               ) : (
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <input type="text" id="categoria" name="categoria" required placeholder="Ej. Pago de Vacunas, Feria..." style={{ flex: 1 }} autoFocus/>
                   <button type="button" className="btn-primary" onClick={() => setUsaOtraCategoria(false)} style={{ padding: '0 1rem' }}>Volver</button>
                 </div>
               )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción Breve / Concepto</label>
            <input type="text" id="descripcion" name="descripcion" placeholder="¿Por qué concepto se movió este dinero?" />
          </div>

          <div className="form-group">
            <label htmlFor="comentarios">Comentarios Adicionales (Opcional)</label>
            <textarea id="comentarios" name="comentarios" rows={3} placeholder="Detalles de facturas, cheques, personas involucradas..."></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.05rem', backgroundColor: tipoSeleccionado === 'Ingreso' ? 'var(--success)' : 'var(--error)' }}>
              {tipoSeleccionado === 'Ingreso' ? 'Registrar Ingreso de Dinero' : 'Registrar Salida de Dinero'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
