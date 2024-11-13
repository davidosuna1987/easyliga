<script setup lang="ts">
type EasyTabItem = { key: string; label: string }

const props = defineProps({
  items: {
    type: Array as PropType<EasyTabItem[]>,
    required: true,
  },
  cols: {
    type: Number,
    required: false,
  },
  gap: {
    type: Number,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'tab:changed', value: string): void
}>()

const selectedTab = ref<string>(props.items[0].key)

const handleTabChanged = (key: string) => {
  selectedTab.value = key
  emit('tab:changed', key)
}
</script>

<template>
  <EasyGrid
    class="easy-tabs-component"
    :cols="cols ?? items.length"
    :gap="gap ?? 3"
  >
    <Button
      v-for="item of items"
      size="small"
      :label="item.label"
      :key="item.key"
      :outlined="selectedTab !== item.key"
      @click="handleTabChanged(item.key)"
    />
  </EasyGrid>
</template>

<script lang="ts">
export default {
  name: 'EasyTabs',
}
</script>
