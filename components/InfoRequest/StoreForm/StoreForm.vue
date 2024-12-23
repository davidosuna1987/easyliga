<script setup lang="ts">
import InfoRequestService from '@/services/info-request'
import {
  DEFAULT_INFO_REQUEST_FORM,
  InfoRequestStoreRequest,
} from '@/domain/info-request'
import { PricingPlan, PricingPlanTemporality } from '@/domain/pricing-plan'
import { isValidEmail, $ } from '@/domain/utils'

const props = defineProps({
  email: {
    type: String,
    required: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
  (e: 'success', value: boolean): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const infoRequestService = new InfoRequestService()

const form = ref<InfoRequestStoreRequest>(DEFAULT_INFO_REQUEST_FORM)
const loadingApi = ref(false)

const handleSubmit = async () => {
  if (!form.value.email) {
    toast.error('Debes ingresar tu correo electrónico')
    loadingApi.value = false
    $('#info-request-store-form-id')?.focus()
    return
  }

  if (!isValidEmail(form.value.email)) {
    toast.error('Debes ingresar un correo electrónico válido')
    loadingApi.value = false
    $('#info-request-store-form-id')?.focus()
    return
  }

  loadingApi.value = true

  const { error } = await infoRequestService.store(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else {
    toast.success(t('info_requests.submitted'))
    emit('success', true)
  }

  loadingApi.value = false
}

const setSelectedPricingPlan = (pricingPlan?: PricingPlan) => {
  form.value.pricingPlan = pricingPlan?.id
}

const setSelectedTemporality = (temporality?: PricingPlanTemporality) => {
  form.value.temporality = temporality
}

watch(
  () => props.email,
  value => {
    form.value.email = value ?? ''
  },
)

watch(loadingApi, value => {
  emit('loading', value)
})

onMounted(() => {
  form.value.email = props.email ?? ''
})

defineExpose({
  handleSubmit,
  loadingApi,
  form,
})
</script>

<template>
  <form
    class="easy-info-request-store-form-component"
    @submit.prevent="handleSubmit"
  >
    <EasyGrid :gap="3">
      <FormLabel :label="t('forms.email')" required>
        <InputText
          v-model="form.email"
          id="info-request-store-form-id"
          class="w-full"
          :readonly="readonly"
          :disabled="loadingApi"
        />
      </FormLabel>

      <FormLabel :label="t('forms.name')">
        <InputText
          v-model="form.name"
          class="w-full"
          :readonly="readonly"
          :disabled="loadingApi"
        />
      </FormLabel>

      <FormLabel :label="t('forms.phone')">
        <InputText
          v-model="form.phone"
          class="w-full"
          :readonly="readonly"
          :disabled="loadingApi"
        />
      </FormLabel>

      <FormLabel :label="t('pricing_plans.select')">
        <WebPricingSelector
          :readonly="readonly"
          :disabled="loadingApi"
          @pricingPlan:selected="setSelectedPricingPlan"
        />
      </FormLabel>

      <FormLabel :label="t('pricing_plans.temporality.select')">
        <WebPricingTemporalitySelector
          :readonly="readonly"
          :disabled="loadingApi"
          @temporality:selected="setSelectedTemporality"
        />
      </FormLabel>

      <FormLabel :label="t('forms.message')">
        <Textarea
          class="w-full"
          v-model="form.message"
          :rows="5"
          autoResize
          :readonly="readonly"
          :disabled="loadingApi"
        />
      </FormLabel>
    </EasyGrid>
  </form>
</template>

<script lang="ts">
export default {
  name: 'InfoRequestStoreForm',
}
</script>
