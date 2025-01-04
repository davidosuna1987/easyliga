<script setup lang="ts">
import {
  InfoRequestFormRef,
  InfoRequestStoreRequest,
} from '@/domain/info-request'
import { PricingPlan, PricingPlanTemporality } from '@/domain/pricing-plan'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: false,
  },
  pricingPlan: {
    type: Object as PropType<PricingPlan>,
    required: false,
  },
  temporality: {
    type: String as PropType<PricingPlanTemporality>,
    required: false,
  },
  infoOnly: {
    type: Boolean,
    default: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'hide'): void
  (e: 'refresh', value: InfoRequestStoreRequest): void
}>()

const { t } = useI18n()

const infoRequestFormRef = ref<InfoRequestFormRef>()
const showDialog = ref<boolean>(props.visible)
const loadingApi = ref<boolean>(false)

const handleFormSubmit = () => {
  infoRequestFormRef.value?.handleSubmit()
}

watch(
  () => props.visible,
  value => {
    showDialog.value = !!value
  },
)

onMounted(() => {
  showDialog.value = props.visible
})
</script>

<template>
  <DialogBottom
    class="easy-alert-dialog-component"
    :visible="!!showDialog"
    :hasStickyFooter="!props.readonly"
    @hide="emit('hide')"
  >
    <template #header>
      <Heading tag="h5">{{ t('info_requests.request') }}</Heading>
    </template>

    <InfoRequestStoreForm
      ref="infoRequestFormRef"
      class="mt-6"
      :email="email"
      :pricingPlan="pricingPlan"
      :temporality="temporality"
      :infoOnly="props.infoOnly"
      :readonly="readonly"
      @success="emit('hide')"
      @loading="loadingApi = $event"
      @cancel="emit('hide')"
    />

    <template #stickyFooter>
      <FormFooterActions
        v-if="!props.readonly"
        class="mt-10"
        :loading="loadingApi"
        :disabled="loadingApi"
        :submitLabel="t('forms.submit')"
        :showCancelLoading="false"
        @form:submit="handleFormSubmit"
        @form:cancel="emit('hide')"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'InfoRequestDialogForm',
}
</script>
