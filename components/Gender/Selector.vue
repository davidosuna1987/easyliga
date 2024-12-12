<script setup lang="ts">
import { useGenderStore } from '@/stores/useGenderStore'
import { Gender, mapApiGenderToGender } from '@/domain/game'

const props = defineProps({
  genders: {
    type: Array as PropType<Gender[]>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hiddenGenderIds: {
    type: Array as PropType<number[]>,
    default: [],
  },
})

const emit = defineEmits<{
  (e: 'gender:selected', value: Gender | undefined): void
  (e: 'gender:fetch', value: Gender[]): void
}>()

const { t } = useI18n()
const easyStorage = useEasyStorage()
const genderStore = useGenderStore()

const selectedGender = ref<Gender>()
const loadingApi = ref<boolean>(false)

const selectableGenders = ref<Gender[]>(props.genders ?? [])

const options = computed((): Gender[] => {
  const genders = props.genders ?? selectableGenders.value
  return genders.filter(gender => !props.hiddenGenderIds.includes(gender.id))
})

const getGenders = async () => {
  loadingApi.value = true
  const { data } = await genderStore.fetch()
  easyStorage.set('genders.genders', data.value?.data.genders ?? [])
  selectableGenders.value =
    data.value?.data.genders.map(mapApiGenderToGender) ?? []
  emit('gender:fetch', selectableGenders.value)
  loadingApi.value = false
}

const setSelectedGender = (gender?: Gender) => {
  selectedGender.value = gender
  emit('gender:selected', selectedGender.value)
}

watch(
  () => props.hiddenGenderIds,
  value => {
    if (selectedGender.value && value.includes(selectedGender.value.id)) {
      setSelectedGender()
    }
  },
)

onMounted(() => {
  if (!selectableGenders.value.length) {
    getGenders()
  }
})
</script>

<template>
  <Dropdown
    class="easy-genders-selector-component"
    v-model="selectedGender"
    :disabled="props.disabled"
    :loading="props.loading || loadingApi"
    :options="options"
    :optionLabel="gender => t(`genders.${gender.name}`)"
    scrollHeight="210px"
    :placeholder="t('genders.select')"
    @update:modelValue="setSelectedGender"
  />
</template>

<script lang="ts">
export default {
  name: 'GenderSelector',
}
</script>
