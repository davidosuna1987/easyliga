export type PricingPlanTemporality = 'month' | 'year'

export type PricingPlanPricing = {
  [key in PricingPlanTemporality]: number
}

export type PricingPlan = {
  title: string
  description: string
  pricing: PricingPlanPricing
  features: string[]
  highlighted?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
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
