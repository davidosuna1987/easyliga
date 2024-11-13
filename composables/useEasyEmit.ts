import mitt from 'mitt'
import { TeamSide } from '@/domain/team'

type EasyEvents = {
  'game-call-sidebar:open': TeamSide
  'game-call-sidebar:close': TeamSide
  'user-invite:loading': boolean
  'user-invite:submit': void
}

const emitter = mitt<EasyEvents>()

export const easyEmit = emitter.emit
export const easyListen = emitter.on
export const easyUnlisten = emitter.off
export const easyEmitList = emitter.all
