'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TipoMovimientoInventario } from '@prisma/client'

// Obtiene el estado actual de toda la bodega (físico)
export async function getInventarioGlobal() {
  try {
    const items = await prisma.inventario.findMany({
      orderBy: { nombreItem: 'asc' },
      include: {
        movimientos: {
          orderBy: { fecha: 'desc' },
          take: 1 // Traer por si acaso la info del último movimiento 
        }
      }
    })
    return { success: true, data: items }
  } catch (error) {
    console.error("Error obteniendo el inventario general:", error)
    return { success: false, data: [] }
  }
}

// Devuelve el historial del Kardex total
export async function getHistorialMovimientos() {
  try {
    const movs = await prisma.movimientoInventario.findMany({
      orderBy: { fecha: 'desc' },
      take: 50,
      include: {
        inventario: {
          select: { nombreItem: true, unidadMedida: true }
        }
      }
    })
    return { success: true, data: movs }
  } catch (error) {
    console.error("Error historial kardex:", error)
    return { success: false, data: [] }
  }
}

// Función 1: Crea un registro nuevo en el catálogo de productos
export async function registrarNuevoItem(formData: FormData) {
  const nombreItem = formData.get('nombreItem') as string
  const unidadMedida = formData.get('unidadMedida') as string
  const cantidadInicialStr = formData.get('cantidadInicial') as string
  const comentarios = formData.get('comentarios') as string

  if (!nombreItem || !unidadMedida || !cantidadInicialStr) {
    return { success: false, message: 'Faltan campos obligatorios en el catálogo.' }
  }

  const cantidadDecimal = parseFloat(cantidadInicialStr)

  try {
    await prisma.inventario.create({
      data: {
        nombreItem: nombreItem.trim(),
        unidadMedida: unidadMedida.trim(),
        cantidadDisponible: isNaN(cantidadDecimal) ? 0 : cantidadDecimal,
        comentarios: comentarios || null
      }
    })
  } catch (error) {
    console.error("Error catagolando insumo:", error)
    return { success: false, message: 'Posible ítem duplicado o error técnico.' }
  }

  revalidatePath('/inventario')
  redirect('/inventario')
}

// Función 2: Realiza el movimiento en el Kardex y actualiza la bóveda matemáticamente
export async function registrarMovimientoKardex(formData: FormData) {
  const inventarioId = formData.get('inventarioId') as string
  const tipo = formData.get('tipo') as TipoMovimientoInventario
  const fechaStr = formData.get('fecha') as string
  const justificacion = formData.get('justificacion') as string
  const cantidadStr = formData.get('cantidad') as string
  const comentarios = formData.get('comentarios') as string

  if (!inventarioId || !fechaStr || !justificacion || !cantidadStr || !tipo) {
    return { success: false, message: 'Faltan campos básicos para asentar la descarga/ingreso.' }
  }

  const cantidad = parseFloat(cantidadStr)
  if (isNaN(cantidad) || cantidad <= 0) {
    return { success: false, message: 'La cantidad del movimiento debe ser superior a cero.' }
  }

  try {
    // Iniciar transacción síncrona en postgres (Garantiza seguridad de cruces)
    await prisma.$transaction(async (tx) => {
      // 1. Obtener el item para saber cuánto hay
      const item = await tx.inventario.findUnique({ where: { id: inventarioId } })
      if (!item) throw new Error("Insumo principal no mapeado.")

      let nuevaCandidad = Number(item.cantidadDisponible)

      // 2. Ejecutar la aritmética correcta
      if (tipo === 'Entrada') nuevaCandidad += cantidad
      if (tipo === 'Salida') nuevaCandidad -= cantidad
      if (tipo === 'Ajuste') {
        // Asumiremos que el tipo 'Ajuste' establece el número físico exacto sobrante
        // por pérdida/conteo físico manual del granjero. (e.j Te diste cuenta que solo hay 3).
        nuevaCandidad = cantidad
      }

      // Si es salida, prevenimos matemáticamente si el stock da negativo 
      // (Opcional, en muchas granjas el stock se deja en negativo hasta ser auditado, lo permitiremos)

      // 3. Crear Historial del Kardex
      await tx.movimientoInventario.create({
        data: {
          inventarioId,
          tipo,
          cantidad,
          fecha: new Date(fechaStr),
          justificacion,
          comentarios: comentarios || null
        }
      })

      // 4. Actualizar estado real de la bodega
      await tx.inventario.update({
        where: { id: inventarioId },
        data: { cantidadDisponible: nuevaCandidad }
      })
    }) // Fin de transacción
  } catch (error) {
    console.error("Transacción inventario cancelada:", error)
    return { success: false, message: 'Falló la escritura del movimiento contra bodega.' }
  }

  revalidatePath('/inventario')
  redirect('/inventario')
}
