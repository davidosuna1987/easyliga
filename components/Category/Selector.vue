<script setup lang="ts">
import { useCategoryStore } from '@/stores/useCategoryStore'
import { Category, mapApiCategoryToCategory } from '@/domain/game'

const props = defineProps({
  categories: {
    type: Array as PropType<Category[]>,
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
  hiddenCategoryIds: {
    type: Array as PropType<number[]>,
    default: [],
  },
})

const emit = defineEmits<{
  (e: 'category:selected', value: Category | undefined): void
  (e: 'category:fetch', value: Category[]): void
}>()

const { t } = useI18n()
const easyStorage = useEasyStorage()
const catagoryStore = useCategoryStore()

const selectedCategory = ref<Category>()
const loadingApi = ref<boolean>(false)

const selectableCategories = ref<Category[]>(props.categories ?? [])

const options = computed((): Category[] => {
  const categories = props.categories ?? selectableCategories.value
  return categories.filter(
    category => !props.hiddenCategoryIds.includes(category.id),
  )
})

const getCategories = async () => {
  loadingApi.value = true

  const { data } = await catagoryStore.fetch()

  selectableCategories.value =
    data.value?.data.categories.map(mapApiCategoryToCategory) ?? []

  easyStorage.set('categories.categories', data.value?.data.categories)

  emit('category:fetch', selectableCategories.value)

  loadingApi.value = false
}

const setSelectedCategory = (category?: Category) => {
  selectedCategory.value = category
  emit('category:selected', selectedCategory.value)
}

watch(
  () => props.hiddenCategoryIds,
  value => {
    if (selectedCategory.value && value.includes(selectedCategory.value.id)) {
      setSelectedCategory()
    }
  },
)

onMounted(() => {
  if (!selectableCategories.value.length) {
    getCategories()
  }
})
</script>

<template>
  <Dropdown
    class="easy-categories-selector-component"
    v-model="selectedCategory"
    :disabled="props.disabled"
    :loading="props.loading || loadingApi"
    :options="options"
    :optionLabel="category => t(`categories.${category.name}`)"
    scrollHeight="210px"
    :placeholder="t('categories.select')"
    @update:modelValue="setSelectedCategory"
  />
</template>

<script lang="ts">
export default {
  name: 'Categorieselector',
}
</script>
