<script setup lang="ts">
import { Role } from '@/domain/role'

const props = defineProps({
  roles: {
    type: Array as PropType<Role[]>,
    required: true,
  },
})

const { t } = useI18n()
</script>

<template>
  <div class="flex gap-2">
    <Tag v-for="role in roles" :value="t(`roles.type.${role}`)" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RoleTags',
}
</script>
