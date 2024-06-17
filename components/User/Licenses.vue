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

const auth = useAuthStore()
const { roles } = useAuthStore()

const filters = ref<LicensableType[]>([])
const selectedType = ref<LicensableType | 'all'>('all')

const filteredLicenses = computed(() =>
  props.licenses.filter(license => license.type === selectedType.value),
)

const handleLicenseSuccess = () => {
  auth.fresh()
}

onMounted(() => {
  filters.value = LICENSABLE_ROLES.filter(role => roles.includes(role))
  selectedType.value = filters.value[0] || 'all'
})
</script>

<template>
  <section class="easy-user-licenses-component">
    <LicenseFilter
      :options="filters"
      :type="selectedType"
      @type:selected="selectedType = $event"
    />

    <LicenseList
      class="mt-6"
      :type="selectedType"
      :licenses="filteredLicenses"
      @license:success="handleLicenseSuccess"
    />
  </section>
</template>

<script lang="ts">
export default {
  name: 'UserLicenses',
}
</script>
