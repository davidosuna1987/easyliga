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
})

const emit = defineEmits<{
  (e: 'category:selected', value: Category): void
}>()

const { t } = useI18n()
const easyStorage = useEasyStorage()
const catagoryStore = useCategoryStore()

const selectedCategory = ref<Category>()
const loadingApi = ref<boolean>(false)

const categories = ref<Category[]>(props.categories ?? [])
const options = computed((): Category[] => props.categories ?? categories.value)

const getCategories = async () => {
  loadingApi.value = true
  const { data } = await catagoryStore.fetch()
  categories.value =
    data.value?.data.categories.map(mapApiCategoryToCategory) ?? []

  easyStorage.set('categories.categories', data.value?.data.categories)
  loadingApi.value = false
}

onMounted(() => {
  if (!categories.value.length) {
    getCategories()
  }
})
</script>

<template>
  <Dropdown
    class="easy-categories-selector-component"
    v-model="selectedCategory"
    :loading="props.loading || loadingApi"
    :options="options"
    :optionLabel="category => t(`categories.${category.name}`)"
    scrollHeight="210px"
    :placeholder="t('categories.select')"
    @update:modelValue="emit('category:selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'Categorieselector',
}
</script>
