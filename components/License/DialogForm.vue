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
  (e: 'license:created', value: License): void
  (e: 'license:updated', value: License): void
  (e: 'hide', value: boolean): void
}>()

const showDialog = ref<boolean>(!!props.visible)
const licenseFormRef = ref<HTMLFormElement>()

const action = computed(() => (props.license ? 'edit' : 'add'))

const handleFormSubmit = () => {
  licenseFormRef.value?.handleSubmit()
}

const handleLicenseFormCreated = (apiLicense: ApiLicense) => {
  emit('license:updated', mapApiLicenseToLicense(apiLicense))
}

const handleLicenseFormUpdated = (apiLicense: ApiLicense) => {
  emit('license:updated', mapApiLicenseToLicense(apiLicense))
}

const handleSuccess = () => {
  emit('hide', true)
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
      @license:created="handleLicenseFormCreated"
      @license:updated="handleLicenseFormUpdated"
      @success="handleSuccess"
    />

    <template #footer>
      <FormFooterActions
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
