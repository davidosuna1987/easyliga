export type ListColor = 'primary' | 'blue' | 'pink' | 'yellow'

export const getListTagColor = (
  type: 'masculine' | 'femenine' | 'mixed' | undefined,
): ListColor => {
  switch (type) {
    case 'masculine':
      return 'blue'
    case 'femenine':
      return 'pink'
    case 'mixed':
      return 'yellow'
    default:
      return 'primary'
  }
}
