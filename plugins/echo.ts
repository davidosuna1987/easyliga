import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: any
    Echo: any
  }
}

export default defineNuxtPlugin(() => {
  const app = useNuxtApp()
  window.Pusher = Pusher
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'key',
    wsHost: 'api.easyliga.test',
    wsPort: 6001,
    wssPort: 6001,
    encrypted: true,
    cluster: 'mt1',
    forceTLS: true,
  })
})
