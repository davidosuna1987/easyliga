<script setup lang="ts">
import { useGenderStore } from '@/stores/useGenderStore'
import { Gender, mapApiGenderToGender } from '@/domain/game'

const props = defineProps({
  genders: {
    type: Array as PropType<
      {
        id: number
        name: 'masculine' | 'femenine' | 'mixed'
      }[]
    >,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (
    e: 'gender:selected',
    value: {
      id: number
      name: 'masculine' | 'femenine' | 'mixed'
    },
  ): void
}>()

const { t } = useI18n()
const easyStorage = useEasyStorage()
const genderStore = useGenderStore()

const selectedGender = ref<{
  id: number
  name: 'masculine' | 'femenine' | 'mixed'
}>()
const loadingApi = ref<boolean>(false)

const genders = ref<
  {
    id: number
    name: 'masculine' | 'femenine' | 'mixed'
  }[]
>(
  props.genders ??
    easyStorage.getNested('genders.genders', []).map(mapApiGenderToGender),
)
const options = computed(
  (): {
    id: number
    name: 'masculine' | 'femenine' | 'mixed'
  }[] => props.genders ?? genders.value,
)

const getGenders = async () => {
  loadingApi.value = true
  const { data } = await genderStore.fetch()
  genders.value = data.value?.data.genders.map(mapApiGenderToGender) ?? []
  loadingApi.value = false
}

onMounted(() => {
  if (!genders.value.length) {
    getGenders()
  }
})
</script>

<template>
  <Dropdown
    class="easy-genders-selector-component"
    v-model="selectedGender"
    :loading="props.loading || loadingApi"
    :options="options"
    :optionLabel="gender => t(`genders.${gender.name}`)"
    scrollHeight="210px"
    :placeholder="t('genders.select')"
    @update:modelValue="emit('gender:selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'GenderSelector',
}
</script>
