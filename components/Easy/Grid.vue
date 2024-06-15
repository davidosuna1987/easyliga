<script setup lang="ts">
import { GridBreakpoints, mapBreakpointsToClasses } from '@/domain/grid'

const props = defineProps({
  cols: {
    type: Number,
    required: false,
  },
  gap: {
    type: Number,
    required: false,
  },
  gapX: {
    type: Number,
    required: false,
  },
  gapY: {
    type: Number,
    required: false,
  },
  breakpoints: {
    type: Object as PropType<GridBreakpoints>,
    required: false,
  },
  center: {
    type: Boolean,
    default: false,
  },
  justify: {
    type: String,
    required: false,
  },
  items: {
    type: String,
    required: false,
  },
})

const columns = computed(() =>
  !!props.breakpoints?.xs
    ? props.breakpoints.xs
    : !!props.cols
    ? props.cols
    : undefined,
)

const mappedBreakpoints = computed(() =>
  props.breakpoints ? mapBreakpointsToClasses(props.breakpoints) : undefined,
)
</script>

<template>
  <div
    :class="[
      'easy-grid-component grid',
      !!columns && `grid-cols-${columns}`,
      !!gap && `gap-${gap}`,
      !!gapX && `gap-x-${gapX}`,
      !!gapY && `gap-y-${gapY}`,
      !!mappedBreakpoints && mappedBreakpoints,
      !!center && 'place-content-center',
      !!justify && `justify-${justify}`,
      !!items && `items-${items}`,
    ]"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
@for $i from 1 through 12 {
  .grid-cols-#{$i} {
    grid-template-columns: repeat(#{$i}, minmax(0, 1fr));
  }
}

@media (min-width: 640px) {
  @for $i from 1 through 12 {
    .sm\:grid-cols-#{$i} {
      grid-template-columns: repeat(#{$i}, minmax(0, 1fr));
    }
  }
}

@media (min-width: 768px) {
  @for $i from 1 through 12 {
    .md\:grid-cols-#{$i} {
      grid-template-columns: repeat(#{$i}, minmax(0, 1fr));
    }
  }
}

@media (min-width: 1024px) {
  @for $i from 1 through 12 {
    .lg\:grid-cols-#{$i} {
      grid-template-columns: repeat(#{$i}, minmax(0, 1fr));
    }
  }
}

@media (min-width: 1280px) {
  @for $i from 1 through 12 {
    .xl\:grid-cols-#{$i} {
      grid-template-columns: repeat(#{$i}, minmax(0, 1fr));
    }
  }
}

@media (min-width: 1536px) {
  @for $i from 1 through 12 {
    .\2xl\:grid-cols-#{$i} {
      grid-template-columns: repeat(#{$i}, minmax(0, 1fr));
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'EasyGrid',
}
</script>
