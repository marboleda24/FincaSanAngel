import prisma from '@/lib/prisma'

export async function getMetricasDashboard() {
  try {
    // 1. Ganado Activo
    const ganadoActivo = await prisma.bovino.count({
      where: { estado: 'Activo' }
    })

    // 2. Alertas de Inventario
    const alertasBodega = await prisma.inventario.count({
      where: {
        cantidadDisponible: {
          lt: 5
        }
      }
    })

    // 3. Producción Lechera de Hoy (o todo el registro parcial)
    // Para no ser tan estrictos en el conteo complejo, daremos el conteo de los ordeños registrados 
    const conteoOrdenos = await prisma.produccionLeche.count()

    // 4. Finanzas Globales de Caja
    const transacciones = await prisma.transaccionFinanciera.findMany({ select: { tipo: true, monto: true } })
    let balanceGeneral = 0
    transacciones.forEach(tx => {
      if (tx.tipo === 'Ingreso') balanceGeneral += Number(tx.monto)
      if (tx.tipo === 'Gasto') balanceGeneral -= Number(tx.monto)
    })

    return { 
      success: true, 
      data: {
        ganadoActivo,
        alertasBodega,
        conteoOrdenos,
        balanceGeneral
      }
    }

  } catch (error) {
    console.error("Fallo obteniendo las métricas del nodo en vivo:", error)
    return {
      success: false,
      data: { ganadoActivo: 0, alertasBodega: 0, conteoOrdenos: 0, balanceGeneral: 0 }
    }
  }
}
