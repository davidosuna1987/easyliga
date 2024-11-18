<script setup lang="ts">
const props = defineProps({
  observations: {
    type: String,
    required: false,
  },
  warning: {
    type: String,
    required: false,
  },
})

const { t } = useI18n()
</script>

<template>
  <article class="easy-game-report-observations-component">
    <header
      class="report-observations-header border-solid p-2 grid place-content-center"
    >
      <strong class="uppercase">{{ t('observations.observation', 2) }}</strong>
    </header>
    <main class="report-observations-main border-solid p-2 min-h-[110px]">
      <p
        v-if="warning"
        class="text-sm mb-2 text-[var(--tertiary-color-darken)]"
      >
        {{ warning }}
      </p>
      <Textarea
        :value="observations"
        readonly
        unstyled
        autoResize
        :style="{
          resize: 'none',
        }"
      />
    </main>
  </article>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleObservations',
}
</script>
