import { GenderType } from '@/domain/game'

export type ListColor =
  | 'primary'
  | 'blue'
  | 'pink'
  | 'yellow'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'

export const getListTagColor = (type?: GenderType): ListColor => {
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
