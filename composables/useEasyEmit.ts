import mitt from 'mitt'
import { EasyEvents } from '@/domain/event'

const emitter = mitt<EasyEvents>()

export const easyEmit = emitter.emit
export const easyListen = emitter.on
export const easyUnlisten = emitter.off
export const easyEmitList = emitter.all
