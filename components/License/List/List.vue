<script setup lang="ts">
import { LicensableModel, LicensableType } from '@/domain/licensable'
import { License } from '@/domain/license'

const props = defineProps({
  type: {
    type: String as PropType<LicensableType | 'all'>,
    required: true,
  },
  licenses: {
    type: Array as PropType<License[]>,
    default: [],
  },
  licensable: {
    type: Object as PropType<LicensableModel>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'license:success', value: string): void
}>()

const { t } = useI18n()

const showLicenseDialogForm = ref<boolean>(false)
const licenseToShow = ref<License>()
const formLicense = ref<License>()

const handleLicenseShow = (license: License) => {
  licenseToShow.value = license
}

const handleLicenseCreate = () => {
  formLicense.value = undefined
  showLicenseDialogForm.value = true
}

const handleLicenseEdit = (license: License) => {
  formLicense.value = license
  showLicenseDialogForm.value = true
}

const handleLicenseDialogFormSuccess = (action: string) => {
  emit('license:success', action)
  handleLicenseDialogFormHide()
}

const handleLicenseDialogFormHide = () => {
  formLicense.value = undefined
  showLicenseDialogForm.value = false
}
</script>

<template>
  <div class="easy-license-list-component">
    <header class="header flex justify-between items-center mb-5">
      <Heading tag="h6" position="center">
        {{
          type === 'all'
            ? t('licenses.all')
            : t(`licenses.type_long.${type}`, 2)
        }}
      </Heading>
      <Button
        class="action"
        :label="t('licenses.add')"
        size="small"
        @click.prevent="handleLicenseCreate"
      />
    </header>

    <EasyGrid :gap="3">
      <template
        v-if="!!licenses.length"
        v-for="license in licenses"
        :key="license.id"
      >
        <LicenseListItem
          :license="license"
          @license:show="handleLicenseShow"
          @license:edit="handleLicenseEdit(license)"
          @license:deleted="handleLicenseDialogFormSuccess('deleted')"
        />
      </template>
      <template v-else-if="type">
        {{
          t(`licenses.no_licenses_type`, { type: t(`licenses.type.${type}`) })
        }}
      </template>
    </EasyGrid>

    <LicenseDialogForm
      :visible="showLicenseDialogForm"
      :type="type"
      :license="formLicense"
      :licensable="licensable"
      @hide="handleLicenseDialogFormHide"
      @success="handleLicenseDialogFormSuccess"
    />

    <DialogBottom
      class="easy-alert-dialog-component"
      :visible="!!licenseToShow"
      @hide="licenseToShow = undefined"
    >
      <template #header>
        <Heading tag="h5">{{ t('licenses.details') }}</Heading>
      </template>

      <LicenseShow v-if="licenseToShow" class="mt-6" :license="licenseToShow" />

      <template #footer></template>
    </DialogBottom>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LicenseList',
}
</script>
