'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { GeneroBovino, EstadoBovino } from '@prisma/client'

// Acción para listar el ganado
export async function getBovinos() {
  try {
    const bovinos = await prisma.bovino.findMany({
      orderBy: { fechaNacimiento: 'desc' }
    })
    return { success: true, data: bovinos }
  } catch (error) {
    console.error("Error obteniendo bovinos:", error)
    return { success: false, data: [] }
  }
}

// Acción para obtener una res específica por su ID
export async function getBovinoById(id: string) {
  try {
    const bovino = await prisma.bovino.findUnique({
      where: { id },
      include: {
        eventosMedicos: {
          orderBy: { fechaProgramada: 'desc' }
        },
        produccionLeche: {
          orderBy: { fechaOrdeno: 'desc' },
          take: 30 // Últimas 30 producciones
        }
      }
    })
    
    if (!bovino) return { success: false, data: null }
    return { success: true, data: bovino }
  } catch (error) {
    console.error("Error obteniendo bovino:", error)
    return { success: false, data: null }
  }
}

// Acción para registrar un nuevo animal
export async function registrarBovino(formData: FormData) {
  const identificador = formData.get('identificador') as string
  const raza = formData.get('raza') as string
  const genero = formData.get('genero') as GeneroBovino
  const fechaNacimientoStr = formData.get('fechaNacimiento') as string
  const comentarios = formData.get('comentarios') as string

  if (!identificador || !raza || !genero || !fechaNacimientoStr) {
    return { success: false, message: 'Faltan campos obligatorios' }
  }

  try {
    await prisma.bovino.create({
      data: {
        identificador,
        raza,
        genero,
        estado: 'Activo', // Por defecto todo recién registrado entra como Activo
        fechaNacimiento: new Date(fechaNacimientoStr),
        comentarios: comentarios || null,
      }
    })
  } catch (error) {
    console.error("Error registrando bovino:", error)
    return { success: false, message: 'Ocurrió un error (¿la chapeta ya existe?)' }
  }

  revalidatePath('/ganado')
  redirect('/ganado')
}
