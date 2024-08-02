<script setup lang="ts">
import { GenderIconName } from '@/domain/game'
import { IconNames } from '@/domain/icon'
import { getListTagColor } from '@/domain/list'

const props = defineProps({
  name: {
    type: String as PropType<GenderIconName>,
    required: true,
  },
})

const primaryIconName = computed(() =>
  props.name === 'mixed' ? IconNames.femenine : IconNames[props.name],
)
</script>

<template>
  <span
    class="easy-gender-icon-component w-[22px] flex justify-center relative"
  >
    <Icon
      :class="[
        name === 'masculine'
          ? 'text-[var(--blue-color)]'
          : 'text-[var(--pink-color)]',
        {
          'absolute left-[0.5px] top-1 z-10': name === 'mixed',
        },
      ]"
      :name="primaryIconName"
    />
    <Icon
      v-if="name === 'mixed'"
      :class="[
        'text-[var(--blue-color)]',
        { 'absolute right-[0.5px]': name === 'mixed' },
      ]"
      :name="IconNames.masculine"
    />
  </span>
</template>

<script lang="ts">
export default {
  name: 'GenderIcon',
}
</script>
