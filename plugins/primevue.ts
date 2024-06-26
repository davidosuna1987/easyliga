import config from '@/config/primevue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Menubar from 'primevue/menubar'
import Avatar from 'primevue/avatar'
import TieredMenu from 'primevue/tieredmenu'
import AutoComplete from 'primevue/autocomplete'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Password from 'primevue/password'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Message from 'primevue/message'
import Tooltip from 'primevue/tooltip'
import Checkbox from 'primevue/checkbox'
import Calendar from 'primevue/calendar'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(PrimeVue, config)
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('Dropdown', Dropdown)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('Menubar', Menubar)
  nuxtApp.vueApp.component('Avatar', Avatar)
  nuxtApp.vueApp.component('TieredMenu', TieredMenu)
  nuxtApp.vueApp.component('AutoComplete', AutoComplete)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('InputNumber', InputNumber)
  nuxtApp.vueApp.component('Textarea', Textarea)
  nuxtApp.vueApp.component('Password', Password)
  nuxtApp.vueApp.component('Toast', Toast)
  nuxtApp.vueApp.component('Message', Message)
  nuxtApp.vueApp.component('Checkbox', Checkbox)
  nuxtApp.vueApp.component('Calendar', Calendar)
  nuxtApp.vueApp.component('Tag', Tag)
  nuxtApp.vueApp.component('Badge', Badge)

  nuxtApp.vueApp.use(ToastService)

  nuxtApp.vueApp.directive('tooltip', Tooltip)
})
