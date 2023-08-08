import config from '@/config/primevue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Menubar from 'primevue/menubar'
import Avatar from 'primevue/avatar'
import TieredMenu from 'primevue/tieredmenu'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Message from 'primevue/message'
import Tooltip from 'primevue/tooltip'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(PrimeVue, config)
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('Dropdown', Dropdown)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('Menubar', Menubar)
  nuxtApp.vueApp.component('Avatar', Avatar)
  nuxtApp.vueApp.component('TieredMenu', TieredMenu)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('Password', Password)
  nuxtApp.vueApp.component('Toast', Toast)
  nuxtApp.vueApp.component('Message', Message)

  nuxtApp.vueApp.use(ToastService)

  nuxtApp.vueApp.directive('tooltip', Tooltip)
})
