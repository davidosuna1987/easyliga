export const IconNames = {
  add: 'pepicons-pencil:plus',
  edit: 'pepicons-pencil:pen',
  show: 'mdi:eye-outline',
  delete: 'pepicons-pencil:trash',
  close: 'pepicons-pencil:times',
  check: 'pepicons-pencil:checkmark',
  checkCircle: 'pepicons-pencil:checkmark-circle',
  gameFinished: 'ic:baseline-check-circle-outline',
  trash: 'ic:baseline-delete',
  download: 'pepicons-pencil:cloud-down',
  upload: 'pepicons-pencil:cloud-up',
  search: 'pepicons-pencil:loop',
  link: 'pepicons-pencil:chain',
  refresh: 'ic:round-loop',
  masculine: 'ph:gender-male-duotone',
  femenine: 'ph:gender-female-duotone',
  gear: 'pepicons-pencil:gear',
  chevronLeft: 'pepicons-pencil:angle-left',
  chevronRight: 'pepicons-pencil:angle-right',
} as const

export type IconName = keyof typeof IconNames
