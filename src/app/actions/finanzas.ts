'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TipoTransaccion } from '@prisma/client'

// Acción para obtener el panel completo con estadísticas
export async function getFinanzasDashboard() {
  try {
    const transacciones = await prisma.transaccionFinanciera.findMany({
      orderBy: { fecha: 'desc' },
      take: 100 // Límite razonable para mostrar en la grilla primaria
    })

    // Calcular estadísticas globales en memoria Server-Side
    let totalIngresos = 0
    let totalGastos = 0

    transacciones.forEach(tx => {
      const monto = Number(tx.monto)
      if (tx.tipo === 'Ingreso') totalIngresos += monto
      if (tx.tipo === 'Gasto') totalGastos += monto
    })

    const balanceNeto = totalIngresos - totalGastos

    return { 
      success: true, 
      data: transacciones,
      stats: { totalIngresos, totalGastos, balanceNeto }
    }
  } catch (error) {
    console.error("Error obteniendo transacciones:", error)
    return { success: false, data: [], stats: { totalIngresos: 0, totalGastos: 0, balanceNeto: 0 } }
  }
}

// Acción para agregar un movimiento nuevo a la caja
export async function registrarTransaccion(formData: FormData) {
  const tipo = formData.get('tipo') as TipoTransaccion
  const categoria = formData.get('categoria') as string
  const montoStr = formData.get('monto') as string
  const fechaStr = formData.get('fecha') as string
  const descripcion = formData.get('descripcion') as string
  const comentarios = formData.get('comentarios') as string

  if (!tipo || !categoria || !montoStr || !fechaStr) {
    return { success: false, message: 'Faltan campos obligatorios' }
  }

  const montoDecimal = parseFloat(montoStr)
  if (isNaN(montoDecimal) || montoDecimal <= 0) {
    return { success: false, message: 'El monto debe ser un valor numérico mayor a cero.' }
  }

  try {
    await prisma.transaccionFinanciera.create({
      data: {
        tipo,
        categoria,
        monto: montoDecimal,
        fecha: new Date(fechaStr),
        descripcion: descripcion || null,
        comentarios: comentarios || null
      }
    })
  } catch (error) {
    console.error("Error registrando transacción:", error)
    return { success: false, message: 'Fallo al procesar la inserción contable.' }
  }

  revalidatePath('/finanzas')
  redirect('/finanzas')
}
