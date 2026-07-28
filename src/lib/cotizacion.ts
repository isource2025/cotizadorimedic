import {
  ACCESO_COMPLETO,
  CLINICAS,
  FRACCION_ANCLA_MEDIA,
  PESOS_CAMAS,
  PESOS_TAMANO,
  PISO_MENSUAL,
  PLANES_SAAS,
  TOPE_MENSUAL,
  type Clinica,
  type Complejidad,
  type PlanId,
  type PlanSaas,
} from '../data/clinicas'

export { ACCESO_COMPLETO, PESOS_CAMAS, PLANES_SAAS }

export interface ParametrosPrecio {
  piso: number
  tope: number
}

export interface DetalleCotizacion {
  clinica: Clinica
  indiceTamano: number
  complejidad: Complejidad
  motivoComplejidad: string
  plan: PlanSaas
  fraccionPrecio: number
  cotizacionMensual: number
  bandaPlan: { min: number; max: number }
  servicios: string[]
}

/** Tamaño del cliente: camas totales + plus suave por críticas */
export function calcularTamano(c: Clinica): number {
  return (
    c.totalCamas * PESOS_TAMANO.cama +
    c.camasUtiUco * PESOS_TAMANO.utiUco +
    c.camasUtiNeoPed * PESOS_TAMANO.utiNeoPed +
    c.camasUci * PESOS_TAMANO.uci
  )
}

export function listarServicios(c: Clinica): string[] {
  const s: string[] = []
  if (c.camasGenerales > 0) s.push(`Internación general (${c.camasGenerales})`)
  if (c.camasUtiUco > 0) s.push(`UTI / UCO (${c.camasUtiUco})`)
  if (c.camasUtiNeoPed > 0) s.push(`UTI neonatal / pediátrica (${c.camasUtiNeoPed})`)
  if (c.camasUci > 0) s.push(`UCI intermedia (${c.camasUci})`)
  return s
}

/** Complejidad clínica (informativa) — no limita el producto */
export function clasificarComplejidad(c: Clinica): {
  complejidad: Complejidad
  motivo: string
} {
  if (c.camasUtiNeoPed >= 10) {
    return {
      complejidad: 'alta',
      motivo: `UTI neonatal/pediátrica con ${c.camasUtiNeoPed} camas`,
    }
  }
  if (c.camasUtiUco >= 15) {
    return {
      complejidad: 'alta',
      motivo: `UTI/UCO con ${c.camasUtiUco} camas`,
    }
  }
  if (c.camasUtiUco >= 8 && c.camasUtiNeoPed >= 5) {
    return {
      complejidad: 'alta',
      motivo: `Combinación UTI/UCO (${c.camasUtiUco}) + Neo/Ped (${c.camasUtiNeoPed})`,
    }
  }
  if (c.totalCamas >= 70 && (c.camasUtiUco > 0 || c.camasUtiNeoPed > 0)) {
    return {
      complejidad: 'alta',
      motivo: `Gran escala (${c.totalCamas} camas) con cuidados críticos`,
    }
  }

  if (c.camasUtiUco > 0 || c.camasUci >= 8) {
    return {
      complejidad: 'media',
      motivo:
        c.camasUtiUco > 0
          ? `Cuenta con UTI/UCO (${c.camasUtiUco} camas)`
          : `UCI intermedia con ${c.camasUci} camas`,
    }
  }

  return {
    complejidad: 'baja',
    motivo: 'Sin camas de cuidados críticos (UTI/UCO / Neo-Ped)',
  }
}

function redondearMiles(valor: number): number {
  return Math.round(valor / 1000) * 1000
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n))
}

/**
 * Precio continuo por tamaño:
 * piso ←→ ancla Sarmiento ←→ tope Chaco
 */
export function precioPorTamano(
  clinica: Clinica,
  params: ParametrosPrecio = { piso: PISO_MENSUAL, tope: TOPE_MENSUAL },
): { precio: number; fraccion: number; tamano: number } {
  const piso = Math.max(0, params.piso)
  const tope = Math.max(piso, params.tope)
  const rango = tope - piso
  const precioRef = piso + FRACCION_ANCLA_MEDIA * rango

  const tamano = calcularTamano(clinica)
  const ref = CLINICAS.find((c) => c.esReferenciaMedia)!
  const max = CLINICAS.find((c) => c.esTope)!
  const tamRef = calcularTamano(ref)
  const tamMax = calcularTamano(max)
  const tamMin = Math.min(...CLINICAS.map(calcularTamano))

  if (clinica.esTope) {
    return { precio: tope, fraccion: 1, tamano }
  }
  if (clinica.esReferenciaMedia) {
    return {
      precio: redondearMiles(precioRef),
      fraccion: FRACCION_ANCLA_MEDIA,
      tamano,
    }
  }

  let precio: number
  if (tamano <= tamRef) {
    const t = tamRef > tamMin ? (tamano - tamMin) / (tamRef - tamMin) : 0
    precio = piso + clamp01(t) * (precioRef - piso)
  } else {
    const t = tamMax > tamRef ? (tamano - tamRef) / (tamMax - tamRef) : 1
    precio = precioRef + clamp01(t) * (tope - precioRef)
  }

  precio = redondearMiles(Math.min(tope, Math.max(piso, precio)))
  const fraccion = rango > 0 ? (precio - piso) / rango : 0
  return { precio, fraccion: clamp01(fraccion), tamano }
}

export function planPorFraccion(fraccion: number): PlanSaas {
  const ordered = [...PLANES_SAAS].reverse()
  for (const plan of ordered) {
    if (fraccion >= plan.fraccionMin) return plan
  }
  return PLANES_SAAS[0]
}

export function bandaDePlan(
  planId: PlanId,
  params: ParametrosPrecio = { piso: PISO_MENSUAL, tope: TOPE_MENSUAL },
): { min: number; max: number } {
  const plan = PLANES_SAAS.find((p) => p.id === planId)!
  const rango = Math.max(0, params.tope - params.piso)
  return {
    min: Math.round(params.piso + plan.fraccionMin * rango),
    max: Math.round(params.piso + plan.fraccionMax * rango),
  }
}

export function cotizarClinica(
  clinica: Clinica,
  params: ParametrosPrecio = { piso: PISO_MENSUAL, tope: TOPE_MENSUAL },
): DetalleCotizacion {
  const { complejidad, motivo } = clasificarComplejidad(clinica)
  const { precio, fraccion, tamano } = precioPorTamano(clinica, params)
  const plan = planPorFraccion(fraccion)

  return {
    clinica,
    indiceTamano: tamano,
    complejidad,
    motivoComplejidad: motivo,
    plan,
    fraccionPrecio: fraccion,
    cotizacionMensual: precio,
    bandaPlan: bandaDePlan(plan.id, params),
    servicios: listarServicios(clinica),
  }
}

export function cotizarTodas(
  params: ParametrosPrecio = { piso: PISO_MENSUAL, tope: TOPE_MENSUAL },
): DetalleCotizacion[] {
  return CLINICAS.map((c) => cotizarClinica(c, params)).sort(
    (a, b) => b.cotizacionMensual - a.cotizacionMensual,
  )
}

export function formatARS(valor: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor)
}

export const LABEL_COMPLEJIDAD: Record<Complejidad, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
}

export const LABEL_PLAN: Record<PlanId, string> = {
  starter: 'Compacto',
  professional: 'Estándar',
  business: 'Plus',
  enterprise: 'Escala',
}
