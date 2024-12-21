export type Mask = {
  id: number
  src: string
  aspectRatio: string
}

export const masks: Mask[] = [
  {
    id: 1,
    src: '/images/mask/1.svg',
    aspectRatio: '9 / 7',
  },
  {
    id: 2,
    src: '/images/mask/2.svg',
    aspectRatio: '754 / 331',
  },
  {
    id: 3,
    src: '/images/mask/3.svg',
    aspectRatio: '1043 / 239',
  },
]

export const getMask = (id: number) => masks.find(mask => mask.id === id)

export const getMaskStyles = (id: number) => {
  const mask = getMask(id)
  if (!mask) return

  return {
    maskImage: `url('${mask.src}')`,
    aspectRatio: mask.aspectRatio,
  }
}
