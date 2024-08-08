import config from '@/config/primevue'
import PrimeVue from 'primevue/config'

import AutoComplete from 'primevue/autocomplete'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Menu from 'primevue/menu'
import Menubar from 'primevue/menubar'
import Message from 'primevue/message'
import Password from 'primevue/password'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import TieredMenu from 'primevue/tieredmenu'
import Toast from 'primevue/toast'

import BadgeDirective from 'primevue/badgedirective'
import Tooltip from 'primevue/tooltip'

import ToastService from 'primevue/toastservice'

export default defineNuxtPlugin(nuxtApp => {
  const {
    $i18n: { t, locale },
  } = useNuxtApp()

  const dateFormat =
    locale.value === 'es'
      ? `dd '${t('forms.of')}' MM '${t('forms.of')}' yy`
      : 'dd.mm.yy'

  nuxtApp.vueApp.use(PrimeVue, {
    ...config,
    locale: {
      ...config.locale,
      firstDayOfWeek: 1,
      dateFormat,
    },
  })
  nuxtApp.vueApp.component('AutoComplete', AutoComplete)
  nuxtApp.vueApp.component('Avatar', Avatar)
  nuxtApp.vueApp.component('Badge', Badge)
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('Calendar', Calendar)
  nuxtApp.vueApp.component('Checkbox', Checkbox)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('Dropdown', Dropdown)
  nuxtApp.vueApp.component('InputNumber', InputNumber)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('Menu', Menu)
  nuxtApp.vueApp.component('Menubar', Menubar)
  nuxtApp.vueApp.component('Message', Message)
  nuxtApp.vueApp.component('Password', Password)
  nuxtApp.vueApp.component('Tag', Tag)
  nuxtApp.vueApp.component('Textarea', Textarea)
  nuxtApp.vueApp.component('TieredMenu', TieredMenu)
  nuxtApp.vueApp.component('Toast', Toast)

  nuxtApp.vueApp.use(ToastService)

  nuxtApp.vueApp.directive('badge', BadgeDirective)
  nuxtApp.vueApp.directive('tooltip', Tooltip)
})
