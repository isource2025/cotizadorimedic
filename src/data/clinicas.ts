export type Complejidad = 'baja' | 'media' | 'alta'
export type PlanId = 'starter' | 'professional' | 'business' | 'enterprise'

export interface Clinica {
  id: string
  nombre: string
  localidad: string
  camasGenerales: number
  camasUtiUco: number
  camasUtiNeoPed: number
  camasUci: number
  totalCamas: number
  /** Ancla de tamaño medio (~$600k con piso/tope default) */
  esReferenciaMedia?: boolean
  /** Tope de cartera — Sanatorio Chaco ($1M) */
  esTope?: boolean
}

/** Prestadores — Asociación de Clínicas y Sanatorios del Chaco */
export const CLINICAS: Clinica[] = [
  // —— Resistencia / miembros ——
  {
    id: 'sanatorio-chaco',
    nombre: 'Sanatorio Chaco',
    localidad: 'Resistencia',
    camasGenerales: 46,
    camasUtiUco: 17,
    camasUtiNeoPed: 25,
    camasUci: 0,
    totalCamas: 88,
    esTope: true,
  },
  {
    id: 'frangioli',
    nombre: 'Sanatorio Frangioli de Salud 2000',
    localidad: 'Resistencia',
    camasGenerales: 34,
    camasUtiUco: 9,
    camasUtiNeoPed: 0,
    camasUci: 1,
    totalCamas: 44,
  },
  {
    id: 'cordis',
    nombre: 'Instituto Cordis-Cuore y Hemodinamia',
    localidad: 'Resistencia',
    camasGenerales: 6,
    camasUtiUco: 18,
    camasUtiNeoPed: 0,
    camasUci: 9,
    totalCamas: 33,
  },
  {
    id: 'tesa',
    nombre: 'Instituto Oftalmológico Tesa',
    localidad: 'Resistencia',
    camasGenerales: 2,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 2,
  },
  {
    id: 'materno-infantil',
    nombre: 'Sanatorio Materno Infantil',
    localidad: 'Resistencia',
    camasGenerales: 52,
    camasUtiUco: 8,
    camasUtiNeoPed: 14,
    camasUci: 0,
    totalCamas: 74,
  },
  {
    id: 'ojos-oidos',
    nombre: 'Instituto de Ojos y Oídos',
    localidad: 'Resistencia',
    camasGenerales: 11,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 11,
  },
  {
    id: 'sarmiento',
    nombre: 'Sanatorio Sarmiento',
    localidad: 'Resistencia',
    camasGenerales: 30,
    camasUtiUco: 11,
    camasUtiNeoPed: 0,
    camasUci: 3,
    totalCamas: 44,
    esReferenciaMedia: true,
  },
  {
    id: 'chaco-oeste',
    nombre: 'Sanatorio Chaco Oeste',
    localidad: 'Resistencia',
    camasGenerales: 28,
    camasUtiUco: 9,
    camasUtiNeoPed: 1,
    camasUci: 0,
    totalCamas: 38,
  },
  {
    id: 'salud-mental',
    nombre: 'Espacio Integral de Salud Mental',
    localidad: 'Resistencia',
    camasGenerales: 40,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 40,
  },
  {
    id: 'center',
    nombre: 'Instituto Center',
    localidad: 'Resistencia',
    camasGenerales: 6,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 8,
    totalCamas: 14,
  },
  {
    id: 'renales',
    nombre: 'Centro de Enfermedades Renales',
    localidad: 'Resistencia',
    camasGenerales: 0,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 25,
    totalCamas: 25,
  },
  {
    id: 'sol',
    nombre: 'Instituto Sol',
    localidad: 'Resistencia',
    camasGenerales: 2,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 2,
  },

  // —— Barranqueras ——
  {
    id: 'clinica-barranqueras',
    nombre: 'Clínica Barranqueras',
    localidad: 'Barranqueras',
    camasGenerales: 12,
    camasUtiUco: 5,
    camasUtiNeoPed: 0,
    camasUci: 2,
    totalCamas: 19,
  },

  // —— La Leonesa ——
  {
    id: 'clinica-sallud',
    nombre: 'Clínica Sallud',
    localidad: 'La Leonesa',
    camasGenerales: 16,
    camasUtiUco: 0,
    camasUtiNeoPed: 1,
    camasUci: 0,
    totalCamas: 17,
  },

  // —— Machagai ——
  {
    id: 'clinica-santa-rita',
    nombre: 'Clínica Santa Rita',
    localidad: 'Machagai',
    camasGenerales: 14,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 2,
    totalCamas: 16,
  },

  // —— Quitilipi ——
  {
    id: 'clinica-integral-quitilipi',
    nombre: 'Clínica Integral Servicios de Salud',
    localidad: 'Quitilipi',
    camasGenerales: 26,
    camasUtiUco: 8,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 34,
  },

  // —— Presidencia Roque Sáenz Peña ——
  {
    id: 'clinica-saenz-pena',
    nombre: 'Clínica Sáenz Peña',
    localidad: 'Presidencia Roque Sáenz Peña',
    camasGenerales: 26,
    camasUtiUco: 11,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 37,
  },
  {
    id: 'sanatorio-mayo',
    nombre: 'Sanatorio Mayo Salud Mental',
    localidad: 'Presidencia Roque Sáenz Peña',
    camasGenerales: 53,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 53,
  },
  {
    id: 'clinica-centro-medico',
    nombre: 'Clínica Centro Médico',
    localidad: 'Presidencia Roque Sáenz Peña',
    camasGenerales: 22,
    camasUtiUco: 4,
    camasUtiNeoPed: 0,
    camasUci: 3,
    totalCamas: 29,
  },
  {
    id: 'clinica-avenida',
    nombre: 'Clínica Avenida',
    localidad: 'Presidencia Roque Sáenz Peña',
    camasGenerales: 124,
    camasUtiUco: 21,
    camasUtiNeoPed: 15,
    camasUci: 0,
    totalCamas: 160,
  },
  {
    id: 'instituto-santa-maria',
    nombre: 'Instituto Privado Santa María',
    localidad: 'Presidencia Roque Sáenz Peña',
    camasGenerales: 36,
    camasUtiUco: 12,
    camasUtiNeoPed: 13,
    camasUci: 10,
    totalCamas: 71,
  },

  // —— Juan José Castelli ——
  {
    id: 'clinica-castelli',
    nombre: 'Clínica Castelli',
    localidad: 'Juan José Castelli',
    camasGenerales: 35,
    camasUtiUco: 10,
    camasUtiNeoPed: 6,
    camasUci: 0,
    totalCamas: 51,
  },
  {
    id: 'sanatorio-lazara-valdez',
    nombre: 'Sanatorio Lázara Valdez',
    localidad: 'Juan José Castelli',
    camasGenerales: 18,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 18,
  },

  // —— Villa Ángela ——
  {
    id: 'sanatorio-sur',
    nombre: 'Sanatorio Sur',
    localidad: 'Villa Ángela',
    camasGenerales: 28,
    camasUtiUco: 14,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 42,
  },
  {
    id: 'sanatorio-central-salud',
    nombre: 'Sanatorio Central de Salud',
    localidad: 'Villa Ángela',
    camasGenerales: 28,
    camasUtiUco: 8,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 36,
  },
  {
    id: 'sanatorio-parque',
    nombre: 'Sanatorio Parque',
    localidad: 'Villa Ángela',
    camasGenerales: 18,
    camasUtiUco: 11,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 29,
  },

  // —— Corzuela ——
  {
    id: 'clinica-corzuela',
    nombre: 'Clínica Corzuela',
    localidad: 'Corzuela',
    camasGenerales: 14,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 14,
  },

  // —— Las Breñas ——
  {
    id: 'clinica-las-brenas',
    nombre: 'Clínica Las Breñas',
    localidad: 'Las Breñas',
    camasGenerales: 13,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 13,
  },
  {
    id: 'clinica-regional-brenas',
    nombre: 'Clínica Regional',
    localidad: 'Las Breñas',
    camasGenerales: 10,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 10,
  },

  // —— Hermoso Campo ——
  {
    id: 'clinica-integral-hermoso-campo',
    nombre: 'Clínica Integral',
    localidad: 'Hermoso Campo',
    camasGenerales: 11,
    camasUtiUco: 0,
    camasUtiNeoPed: 0,
    camasUci: 0,
    totalCamas: 11,
  },
]

/** Piso — ningún prestador cotiza por debajo */
export const PISO_MENSUAL = 300_000

/** Tope — Sanatorio Chaco */
export const TOPE_MENSUAL = 1_000_000

/**
 * Índice de tamaño: las camas totales mandan.
 * Las críticas suman un plus suave (no distorsionan 40 vs 44 camas).
 */
export const PESOS_TAMANO = {
  cama: 1,
  utiUco: 0.35,
  utiNeoPed: 0.4,
  uci: 0.2,
} as const

/** Alias para UI de desglose por tipo (peso relativo al tamaño) */
export const PESOS_CAMAS = {
  generales: PESOS_TAMANO.cama,
  uci: PESOS_TAMANO.cama + PESOS_TAMANO.uci,
  utiUco: PESOS_TAMANO.cama + PESOS_TAMANO.utiUco,
  utiNeoPed: PESOS_TAMANO.cama + PESOS_TAMANO.utiNeoPed,
} as const

/** Fracción del rango [piso, tope] donde ancla Sarmiento (~$600k default) */
export const FRACCION_ANCLA_MEDIA = (600_000 - PISO_MENSUAL) / (TOPE_MENSUAL - PISO_MENSUAL)

/** Mismo producto para todos — se cobra por tamaño, sin limitar uso */
export const ACCESO_COMPLETO = [
  'Acceso completo a la plataforma',
  'Todos los módulos incluidos',
  'Sin límite de usuarios ni sedes',
  'El precio solo refleja el tamaño del cliente',
] as const

/**
 * 4 bandas de tamaño (solo packaging de precio).
 * El producto es idéntico en todas.
 */
export const PLANES_SAAS = [
  {
    id: 'starter' as const,
    nombre: 'Compacto',
    tagline: 'Prestadores chicos · mismo producto',
    fraccionMin: 0,
    fraccionMax: 0.25,
  },
  {
    id: 'professional' as const,
    nombre: 'Estándar',
    tagline: 'Tamaño medio · ancla Sarmiento',
    fraccionMin: 0.25,
    fraccionMax: 0.5,
  },
  {
    id: 'business' as const,
    nombre: 'Plus',
    tagline: 'Prestadores grandes · mismo producto',
    fraccionMin: 0.5,
    fraccionMax: 0.75,
  },
  {
    id: 'enterprise' as const,
    nombre: 'Escala',
    tagline: 'Tope de red · ancla Sanatorio Chaco',
    fraccionMin: 0.75,
    fraccionMax: 1,
  },
] as const

export type PlanSaas = (typeof PLANES_SAAS)[number]
