<script setup lang="ts">
import { License } from '@/domain/license'
import { formatDate } from '@/domain/utils'
import { IconNames } from '@/domain/icon'
import LicenseService from '@/services/license'
import { useAuthStore } from '@/stores/useAuthStore'

const props = defineProps({
  license: {
    type: Object as PropType<License>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'license:show', value: License): void
  (e: 'license:edit', value: License): void
  (e: 'license:delete', value: License): void
}>()

const app = useNuxtApp()
const auth = useAuthStore()
const toast = useEasyToast()
const licenseService = new LicenseService()
const showLicenseDetails = ref<boolean>(false)
const showRemoveLicenseDialog = ref<boolean>(false)

const handleRemoveLicense = async () => {
  const { data } = await licenseService.destroy(props.license.id)

  if (data.value) {
    toast.success(app.$i18n.t('licenses.deleted'))
    auth.fresh()
  }
}
</script>

<template>
  <div
    class="easy-license-list-item-component flex justify-between items-center gap-3 px-4 py-2 rounded-md shadow"
  >
    <div class="flex items-center gap-2">
      <Initials
        class="rounded-full"
        :initials="license.countryCode"
        :size="20"
      />
      <span>{{ license.name }}</span>
    </div>

    <div class="flex items-center gap-3">
      <time class="text-sm opacity-75" :datetime="license.expiryDate">
        {{ formatDate(license.expiryDate) }}
      </time>
      <div class="flex items-center gap-2">
        <FormActionIcon
          :icon="IconNames.show"
          type="primary"
          v-tooltip.top="{
            value: $t('licenses.show'),
          }"
          @click.stop="showLicenseDetails = true"
        />
        <FormActionIcon
          :icon="IconNames.edit"
          type="info-dark"
          v-tooltip.top="{
            value: $t('licenses.edit'),
          }"
          @click.stop="emit('license:edit', license)"
        />
        <FormActionIcon
          :icon="IconNames.delete"
          type="danger"
          :outlined="false"
          v-tooltip.top="{
            value: $t('licenses.delete'),
          }"
          @click.stop="showRemoveLicenseDialog = true"
        />
      </div>
    </div>

    <AlertDialog
      :visible="!!showRemoveLicenseDialog"
      :title="$t('licenses.delete')"
      :message="$t('licenses.delete_alert')"
      :acceptLabel="$t('forms.delete')"
      severity="danger"
      @accepted="handleRemoveLicense"
      @hide="showRemoveLicenseDialog = false"
    />

    <DialogBottom
      class="easy-alert-dialog-component"
      :visible="showLicenseDetails"
      @hide="showLicenseDetails = false"
    >
      <template #header>
        <Heading tag="h5">{{ $t('licenses.details') }}</Heading>
      </template>

      <LicenseShow class="mt-6" :license="license" />

      <template #footer>
        <Button
          :label="$t('forms.close')"
          @click="showLicenseDetails = false"
        />
      </template>
    </DialogBottom>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LicenseListItem',
}
</script>
