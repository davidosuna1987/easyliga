<script setup lang="ts">
import { useCategoryStore } from '@/stores/useCategoryStore'
import { Category, mapApiCategoryToCategory } from '@/domain/game'

const easyStorage = useEasyStorage()
const catagoryStore = useCategoryStore()

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

const { t } = useI18n()

const selectedCategory = ref<Category | null>(null)
const loadingApi = ref<boolean>(false)

const categories = ref<Category[]>(
  props.categories ?? easyStorage.getNested('categories.categories', []),
)
const options = computed((): Category[] => props.categories ?? categories.value)

onMounted(async () => {
  if (!props.categories) {
    loadingApi.value = true
    const response = await catagoryStore.fetch()
    categories.value =
      response.data.value?.data.categories.map(mapApiCategoryToCategory) ?? []
    loadingApi.value = false
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
    @update:modelValue="$emit('selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'Categorieselector',
}
</script>
