<script setup lang="ts">
import { SHIRT_COLORS, ShirtColor } from '@/domain/team'

const props = defineProps({
  color: {
    type: String as PropType<ShirtColor>,
    required: false,
  },
})

const { t } = useI18n()

const selectedColor = ref<ShirtColor>()
</script>

<template>
  <Dropdown
    v-model="selectedColor"
    class="easy-team-shirt-color-selector-component"
    :options="[...SHIRT_COLORS]"
    :placeholder="t('teams.shirt_color')"
  >
    <template #value="slotProps">
      <template v-if="slotProps.value">
        <TeamShirtColorItem :color="slotProps.value" />
      </template>
      <template v-else>
        {{ t('shirt_colors.select') }}
      </template>
    </template>
    <template #option="slotProps">
      <TeamShirtColorItem :color="slotProps.option" />
    </template>
  </Dropdown>
</template>

<script lang="ts">
export default {
  name: 'TeamShirtColorSelector',
}
</script>

<style scoped lang="scss">
.color-red {
  background-color: var(--shirt-red);
  border: solid 1px var(--shirt-red-dark);
}

.color-orange {
  background-color: var(--shirt-orange);
  border: solid 1px var(--shirt-orange-dark);
}

.color-yellow {
  background-color: var(--shirt-yellow);
  border: solid 1px var(--shirt-yellow-dark);
}

.color-green {
  background-color: var(--shirt-green);
  border: solid 1px var(--shirt-green-dark);
}

.color-blue {
  background-color: var(--shirt-blue);
  border: solid 1px var(--shirt-blue-dark);
}

.color-purple {
  background-color: var(--shirt-purple);
  border: solid 1px var(--shirt-purple-dark);
}

.color-pink {
  background-color: var(--shirt-pink);
  border: solid 1px var(--shirt-pink-dark);
}

.color-brown {
  background-color: var(--shirt-brown);
  border: solid 1px var(--shirt-brown-dark);
}

.color-gray {
  background-color: var(--shirt-gray);
  border: solid 1px var(--shirt-gray-dark);
}

.color-black {
  background-color: var(--shirt-black);
  border: solid 1px var(--shirt-black);
}

.color-white {
  background-color: var(--shirt-white);
  border: solid 1px var(--shirt-white);
}
</style>
