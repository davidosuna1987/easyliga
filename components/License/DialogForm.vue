<script setup lang="ts">
import { License, mapApiLicenseToLicense } from '@/domain/license'
import { LicensableType } from '@/domain/licensable'
import { ApiLicense } from '@/types/api/license'

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
})

const emit = defineEmits<{
  (e: 'hide', value: boolean): void
  (e: 'loading', value: boolean): void
}>()

const showDialog = ref<boolean>(!!props.visible)
const licenseFormRef = ref<HTMLFormElement>()
const loading = ref<boolean>(false)

const action = computed(() => (props.license ? 'edit' : 'add'))

const handleFormSubmit = () => {
  licenseFormRef.value?.handleSubmit()
}

const handleSuccess = () => {
  emit('hide', true)
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
      <Heading tag="h5">{{ $t(`licenses.${action}`) }}</Heading>
    </template>

    <LicenseForm
      ref="licenseFormRef"
      class="mt-6"
      :type="type"
      :license="license"
      @loading="handleLoading"
      @success="handleSuccess"
    />

    <template #footer>
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
