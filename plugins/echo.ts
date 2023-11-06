import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: any
    Echo: any
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  window.Pusher = Pusher
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: config.public.pusherAppKey,
    wsHost: config.public.pusherAppHost,
    wsPort: 6001,
    wssPort: 6001,
    encrypted: true,
    cluster: 'mt1',
    forceTLS: true,
    disableStats: true,
  })
})

export const channelExists = (channel: string): boolean =>
  Object.keys(window.Echo.connector.channel).includes(channel)
