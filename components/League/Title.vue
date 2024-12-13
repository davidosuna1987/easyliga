<script setup lang="ts">
import { League } from '@/domain/league'
import { LeagueShow } from '@/domain/league-show'
import { getListTagColor } from '@/domain/list'

const props = defineProps({
  league: {
    type: Object as () => League | LeagueShow,
    required: true,
  },
})

const { t } = useI18n()
</script>

<template>
  <header class="easy-league-title-component">
    <Heading position="center">{{ league.name }}</Heading>
    <Heading tag="h6" class="mb-5" position="center">
      {{ league.federation?.name }}
    </Heading>
    <div class="flex justify-center gap-5 relative bottom-2">
      <ListTag
        :label="`${t(`categories.${league.category?.name}`)}`"
        color="primary"
        size="large"
      />
      <ListTag
        :label="`${t(`genders.${league.gender?.name}`)}`"
        :color="getListTagColor(league.gender?.name)"
        size="large"
      />
    </div>
  </header>
</template>

<script lang="ts">
export default {
  name: 'LeagueTitle',
}
</script>
