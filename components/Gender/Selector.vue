<script setup lang="ts">
import { useGenderStore } from '@/stores/useGenderStore'
import { ApiGender } from '@/types/api/gender'

const easyStorage = useEasyStorage()
const genderStore = useGenderStore()

const props = defineProps({
  genders: {
    type: Array as PropType<ApiGender[]>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const selectedGender = ref<ApiGender | null>(null)
const loadingApi = ref<boolean>(false)

const genders = ref<ApiGender[]>(
  props.genders ?? easyStorage.getNested('genders.genders', []),
)
const options = computed((): ApiGender[] => props.genders ?? genders.value)

onMounted(async () => {
  if (!props.genders) {
    loadingApi.value = true
    const response = await genderStore.fetch()
    genders.value = response.data.value?.data.genders ?? []
    loadingApi.value = false
  }
})
</script>

<template>
  <Dropdown
    class="easy-genders-selector-component"
    v-model="selectedGender"
    :loading="props.loading || loadingApi"
    :options="options"
    :optionLabel="gender => $t(`genders.${gender.name}`)"
    optionValue="id"
    scrollHeight="210px"
    :placeholder="$t('genders.select')"
    @update:modelValue="$emit('selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'GenderSelector',
}
</script>
