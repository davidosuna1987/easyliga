import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: false })
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('Dropdown', Dropdown)
  nuxtApp.vueApp.component('Dialog', Dialog)
})
