<script setup lang="ts">
import { License } from '@/domain/license'
import { LICENSABLE_ROLES, LicensableType } from '@/domain/licensable'
import { useAuthStore } from '@/stores/useAuthStore'

const props = defineProps({
  licenses: {
    type: Array as PropType<License[]>,
    required: true,
  },
})

const { roles } = useAuthStore()

const filters = ref<LicensableType[]>([])
const selectedType = ref<LicensableType | 'all'>('all')
const showLicenseDialogForm = ref<boolean>(false)
const formLicense = ref<License>()

const filteredLicenses = computed(() =>
  props.licenses.filter(license => license.type === selectedType.value),
)

const handleLicenseCreate = (type: LicensableType | 'all') => {
  selectedType.value = type
  formLicense.value = undefined
  showLicenseDialogForm.value = true
}

const handleLicenseEdit = (license: License) => {
  formLicense.value = license
  showLicenseDialogForm.value = true
}

const handleLicenseDialogFormHide = () => {
  formLicense.value = undefined
  showLicenseDialogForm.value = false
}

onMounted(() => {
  filters.value = LICENSABLE_ROLES.filter(role => roles.includes(role))
  selectedType.value = filters.value[0] || 'all'
})
</script>

<template>
  <section class="easy-user-licenses-component">
    <div class="p-inputgroup flex justify-center">
      <Button
        v-for="filter in filters"
        :key="filter"
        :label="$t(`licenses.type.${filter}`)"
        :outlined="selectedType !== filter"
        @click.prevent="selectedType = filter"
      />
    </div>

    <LicenseList
      class="mt-6"
      :type="selectedType"
      :licenses="filteredLicenses"
      @license:create="handleLicenseCreate"
      @license:edit="handleLicenseEdit"
    />

    <LicenseDialogForm
      :visible="showLicenseDialogForm"
      :type="selectedType"
      :license="formLicense"
      @hide="handleLicenseDialogFormHide"
    />
  </section>
</template>

<script lang="ts">
export default {
  name: 'UserLicenses',
}
</script>
