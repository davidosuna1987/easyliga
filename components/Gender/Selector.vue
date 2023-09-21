<script setup lang="ts">
import { useGenderStore } from '@/stores/useGenderStore'
import { Gender, mapApiGenderToGender } from '@/domain/game'

const easyStorage = useEasyStorage()
const genderStore = useGenderStore()

const props = defineProps({
  genders: {
    type: Array as PropType<Gender[]>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const selectedGender = ref<Gender | null>(null)
const loadingApi = ref<boolean>(false)

const genders = ref<Gender[]>(
  props.genders ?? easyStorage.getNested('genders.genders', []),
)
const options = computed((): Gender[] => props.genders ?? genders.value)

onMounted(async () => {
  if (!props.genders) {
    loadingApi.value = true
    const response = await genderStore.fetch()
    genders.value =
      response.data.value?.data.genders.map(mapApiGenderToGender) ?? []
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
