export const features: Feature[] = [
  {
    id: 'reports',
    number: 1,
    background: 'var(--seagreen-color-medium)',
  },
  {
    id: 'calls',
    number: 2,
    background: 'var(--hero-purple-light)',
  },
  {
    id: 'image',
    number: 0,
  },
  {
    id: 'calendar',
    number: 3,
    background: '#1f2937',
    color: 'white',
  },
  {
    id: 'classification',
    number: 4,
    background: 'var(--hero-yellow-light)',
  },
  {
    id: 'club',
    number: 5,
    background: 'var(--pink-color-dark)',
    color: 'white',
  },
]

export type FeatureId =
  | 'reports'
  | 'calls'
  | 'image'
  | 'calendar'
  | 'classification'
  | 'club'

export type Feature = {
  id: FeatureId
  number: string | number
  background?: string
  color?: string
}

export const getFeature = (id: FeatureId): Feature =>
  features.find(feature => feature.id === id) as Feature
