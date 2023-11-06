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

  const subdomain = config.public.appEnv !== 'production' ? 'api' : 'socket'
  const domain =
    config.public.appEnv !== 'production'
      ? 'easyliga.test'
      : window.location.hostname
  const pusherKey = 'FhtsfC274mzSEriQdvseeFHLnOLxXvTW'
  const pusherHost = `${subdomain}.${domain.replace('www.', '')}`
  console.log({ pusherAppHost: config.public.pusherAppHost, pusherHost })

  window.Pusher = Pusher
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: pusherKey,
    wsHost: pusherHost,
    wsPort: 6001,
    wssPort: 6001,
    encrypted: true,
    cluster: 'mt1',
    forceTLS: true,
  })
})

export const channelExists = (channel: string): boolean =>
  Object.keys(window.Echo.connector.channel).includes(channel)
