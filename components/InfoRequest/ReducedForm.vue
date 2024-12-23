<script setup lang="ts">
import { isValidEmail, $ } from '@/domain/utils'

const props = defineProps({
  showInput: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'email:valid', value: string | undefined): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const email = ref<string>()

// const handleSubmit = async () => {
//   loadingApi.value = true

//   const { data, error } = await emailService.custom(form.value)

//   if (error.value) {
//     toast.mapError(Object.values(error.value?.data?.errors), false)
//   } else if (data.value) {
//     toast.success(t('emails.submitted'))
//     clearDestinatary()
//   }

//   loadingApi.value = false
// }

const submit = () => {
  let valid: string | undefined = email.value

  if (props.showInput) {
    if (!email.value) {
      toast.error('Debes ingresar tu correo electrónico')
      $('#info-request-reduced-form-id')?.focus()
      valid = undefined
    }

    if (email.value && !isValidEmail(email.value)) {
      toast.error('Debes ingresar un correo electrónico válido')
      $('#info-request-reduced-form-id')?.focus()
      valid = undefined
    }
  }

  emit('email:valid', valid)
}
</script>

<template>
  <form
    @submit.prevent="submit"
    class="easy-info-request-reduced-form-component flex justify-center space-x-3 mt-8"
  >
    <InputText
      v-if="showInput"
      v-model="email"
      id="info-request-reduced-form-id"
      class="px-4 py-3 border rounded-lg w-64"
      placeholder="Tu correo electrónico"
    />
    <Button type="submit">{{ t('pages.landing.hero.button') }}</Button>
  </form>
</template>

<script lang="ts">
export default {
  name: 'InfoRequestReducedForm',
}
</script>
