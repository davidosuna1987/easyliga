export type GridBreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type GridBreakpoints = Partial<Record<GridBreakpointKey, number>>

export const mapBreakpointsToClasses = (
  breakpoints: GridBreakpoints,
): string[] =>
  Object.entries(breakpoints).map(([key, value]) =>
    key !== 'xs'
      ? `${key}:grid-cols-${value}`
      : value > 0
      ? `grid-cols-${value}`
      : '',
  )
