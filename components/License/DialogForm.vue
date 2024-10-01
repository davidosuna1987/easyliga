<script setup lang="ts">
import { License } from '@/domain/license'
import { LicensableModel, LicensableType } from '@/domain/licensable'

const props = defineProps({
  visible: {
    type: Boolean,
    required: false,
  },
  type: {
    type: String as PropType<LicensableType | 'all'>,
    required: true,
  },
  license: {
    type: Object as PropType<License>,
    required: false,
  },
  licensable: {
    type: Object as PropType<LicensableModel>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'success', value: string): void
  (e: 'loading', value: boolean): void
  (e: 'hide', value: boolean): void
}>()

const { t } = useI18n()

const showDialog = ref<boolean>(!!props.visible)
const licenseFormRef = ref<HTMLFormElement>()
const loading = ref<boolean>(false)

const action = computed(() => (props.license ? 'edit' : 'add'))

const handleFormSubmit = () => {
  licenseFormRef.value?.handleSubmit()
}

const handleLoading = (value: boolean) => {
  loading.value = value
}

watch(
  () => props.visible,
  value => {
    showDialog.value = !!value
  },
)
</script>

<template>
  <DialogBottom
    class="easy-license-dialog-form-component"
    :visible="showDialog"
    @hide="emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ t(`licenses.${action}`) }}</Heading>
    </template>

    <LicenseForm
      ref="licenseFormRef"
      class="mt-6"
      :type="type"
      :license="license"
      :licensable="licensable"
      @loading="handleLoading"
      @success="emit('success', $event)"
    />

    <template #stickyFooter>
      <FormFooterActions
        :disabled="loading"
        @form:submit="handleFormSubmit"
        @form:cancel="emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'LicenseDialogForm',
}
</script>
