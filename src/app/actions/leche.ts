'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TurnoOrdeno } from '@prisma/client'

// Acción para obtener solo las hembras que están activas
export async function getHembrasActivas() {
  try {
    const hembras = await prisma.bovino.findMany({
      where: {
        genero: 'Hembra',
        estado: 'Activo'
      },
      orderBy: { identificador: 'asc' }
    })
    return { success: true, data: hembras }
  } catch (error) {
    console.error("Error obteniendo hembras activas:", error)
    return { success: false, data: [] }
  }
}

// Acción para obtener el historial reciente de producciones (global)
export async function getProduccionReciente() {
  try {
    const producciones = await prisma.produccionLeche.findMany({
      orderBy: { fechaOrdeno: 'desc' },
      take: 50,
      include: {
        bovino: {
          select: { identificador: true }
        }
      }
    })
    return { success: true, data: producciones }
  } catch (error) {
    console.error("Error obteniendo producción reciente:", error)
    return { success: false, data: [] }
  }
}

// Acción transaccional para guardar un lote completo de ordeño
export async function registrarLoteOrdeno(formData: FormData) {
  const fechaStr = formData.get('fechaOrdeno') as string
  const turno = formData.get('turno') as TurnoOrdeno
  const comentariosGlobales = formData.get('comentarios') as string

  if (!fechaStr || !turno) {
    return { success: false, message: 'Falta configurar fecha o turno del lote.' }
  }

  const fechaRegistro = new Date(fechaStr)
  
  // Recolectar todos los inputs dinámicos de litros usando FormData
  const recordsToInsert = []

  // Iterar las llaves del form. Las llaves de leche empiezan con "litros_"
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('litros_') && typeof value === 'string') {
      const bovinoId = key.split('litros_')[1]
      const litrosStr = value.trim()
      
      // Solo insertar si el usuario digitó un número mayor a 0
      if (litrosStr !== '') {
        const litrosDecimal = parseFloat(litrosStr)
        if (!isNaN(litrosDecimal) && litrosDecimal > 0) {
          recordsToInsert.push({
            bovinoId,
            fechaOrdeno: fechaRegistro,
            turno: turno,
            litros: litrosDecimal,
            comentarios: comentariosGlobales || null
          })
        }
      }
    }
  }

  if (recordsToInsert.length === 0) {
    return { success: false, message: 'No se ingresaron litros en ninguna res.' }
  }

  try {
    // Usar createMany para insertar el lote en la base de datos velozmente
    await prisma.produccionLeche.createMany({
      data: recordsToInsert
    })
  } catch (error) {
    console.error("Error guardando lote de leche:", error)
    return { success: false, message: 'Fallo al asentar la producción en la BD.' }
  }

  revalidatePath('/leche')
  // También revalidamos las hojas de vida afectadas
  revalidatePath('/ganado/[id]', 'page') 
  redirect('/leche')
}
