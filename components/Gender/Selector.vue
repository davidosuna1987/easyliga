<script setup lang="ts">
import { useGenderStore } from '@/stores/useGenderStore'
import { Gender, mapApiGenderToGender } from '@/domain/game'

const { t } = useI18n()
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

const emit = defineEmits<{
  (e: 'gender:selected', value: Gender): void
}>()

const selectedGender = ref<Gender | null>(null)
const loadingApi = ref<boolean>(false)

const genders = ref<Gender[]>(
  props.genders ??
    easyStorage.getNested('genders.genders', []).map(mapApiGenderToGender),
)
const options = computed((): Gender[] => props.genders ?? genders.value)

const getGenders = async () => {
  loadingApi.value = true
  const { data } = await genderStore.fetch()
  genders.value = data.value?.data.genders.map(mapApiGenderToGender) ?? []
  loadingApi.value = false
}

onMounted(async () => {
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
