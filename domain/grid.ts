export type GridBreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type GridBreakpoints = Partial<Record<GridBreakpointKey, number>>

export const mapBreakpointsToClasses = (
  breakpoints: GridBreakpoints,
): string[] =>
  Object.entries(breakpoints).map(([key, value]) =>
    key === 'xs' ? `grid-cols-${value}` : `${key}:grid-cols-${value}`,
  )
