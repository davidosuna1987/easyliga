export const PRICING_PLAN_TEMPORALITY_MAP = {
  month: 'month',
  year: 'year',
} as const

export type PricingPlanTemporality = keyof typeof PRICING_PLAN_TEMPORALITY_MAP

export type PricingPlanPricing = {
  [key in PricingPlanTemporality]: number
}

export type PricingPlan = {
  id: string
  title: string
  description: string
  pricing: PricingPlanPricing
  features: string[]
  highlighted?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    title: 'Basic',
    description:
      'Ideal para clubs pequeños que quieren organizar su equipo, jugadores y resultados sin complicaciones.',
    pricing: {
      month: 4.99,
      year: 49.9,
    },
    features: [
      'Gestión de 1 equipo',
      'Actas autogeneradas',
      'Gestión de jugadores',
      'Programación de partidos',
    ],
  },
  {
    id: 'standard',
    title: 'Standard',
    description:
      'Perfecto para clubs en crecimiento que necesitan clasificaciones automáticas, estadísticas y reportes detallados.',
    pricing: {
      month: 9.99,
      year: 99.9,
    },
    features: [
      'Gestión de 3 equipos',
      'Actas autogeneradas',
      'Gestión de jugadores',
      'Programación de partidos',
    ],
    highlighted: true,
  },
  {
    id: 'premium',
    title: 'Premium',
    description:
      'La solución definitiva para grandes clubes: notificaciones avanzadas, estadísticas y mucho más.',
    pricing: {
      month: 14.99,
      year: 149.9,
    },
    features: [
      'Gestión de equipos ilimitados',
      'Actas autogeneradas',
      'Gestión de jugadores',
      'Programación de partidos',
    ],
  },
]
