<script setup lang="ts">
import { License } from '@/domain/license'
import { formatDate } from '@/domain/utils'
import { IconNames } from '@/domain/icon'

const props = defineProps({
  license: {
    type: Object as PropType<License>,
    required: true,
  },
})

const handleOpenFilepath = () => {
  window.open(props.license.filepath, '_blank')
}
</script>

<template>
  <section class="easy-license-show-component flex flex-col gap-6">
    <FormLabel :label="$t('licenses.name')">
      <InputText :value="license.name" readonly />
    </FormLabel>

    <EasyGrid :cols="2" :gap="4">
      <FormLabel :label="$t('licenses.type_label')">
        <InputText :value="$t(`licenses.type.${license.type}`)" readonly />
      </FormLabel>

      <FormLabel :label="$t('licenses.country')">
        <CountrySelector v-model="license.country" readonly />
      </FormLabel>
    </EasyGrid>

    <FormLabel :label="$t(`licenses.model.select.${license.type}`)">
      <InputText :value="license.licensableName" readonly />
    </FormLabel>

    <EasyGrid :cols="2" :gap="4">
      <FormLabel :label="$t('licenses.number')">
        <InputText v-model="license.licenseNumber" readonly />
      </FormLabel>

      <FormLabel :label="$t('forms.expiry_date')">
        <InputText :value="formatDate(license.expiryDate)" readonly />
      </FormLabel>
    </EasyGrid>

    <FormLabel :label="$t('observations.observation', 2)">
      <Textarea v-model="license.observations" autoResize readonly />
    </FormLabel>

    <FormLabel :label="$t('forms.file')">
      <FormInputGroup>
        <InputText :value="license.originalFilename" readonly />

        <Button @click="handleOpenFilepath">
          <Icon :name="IconNames.link" size="18" />
        </Button>
      </FormInputGroup>
    </FormLabel>
  </section>
</template>

<script lang="ts">
export default {
  name: 'LicenseShow',
}
</script>
