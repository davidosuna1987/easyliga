export type GridBreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type GridBreakpoints = Partial<Record<GridBreakpointKey, number>>

export const mapBreakpointsToClasses = (breakpoints: GridBreakpoints) =>
  Object.entries(breakpoints)
    .map(([key, value]) => `${key}:grid-cols-${value}`)
    .join(' ')
