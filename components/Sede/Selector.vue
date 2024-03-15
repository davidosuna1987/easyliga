<script setup lang="ts">
import { Sede } from '@/domain/sede'

const props = defineProps({
  sedes: {
    type: Array as PropType<Sede[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const selectedSede = ref<Sede>()
const loadingApi = ref<boolean>(false)

const sedes = ref<Sede[]>(props.sedes)
</script>

<template>
  <Dropdown
    class="easy-sedes-selector-component"
    v-model="selectedSede"
    :loading="props.loading || loadingApi"
    :options="sedes"
    optionLabel="name"
    scrollHeight="210px"
    :placeholder="$t('sedes.select')"
    @update:modelValue="$emit('selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'SedeSelector',
}
</script>
