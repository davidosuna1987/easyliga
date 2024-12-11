<script setup lang="ts">
import { LeagueClassification } from 'domain/league'

const props = defineProps({
  classification: {
    type: Array as PropType<LeagueClassification>,
    required: true,
  },
})

const { t } = useI18n()

const getTeamPosition = (teamId: number) =>
  props.classification.findIndex(team => team.teamId === teamId) + 1
</script>

<template>
  <div
    class="easy-league-classification-table-component easy-table table w-full"
  >
    <div class="easy-table-row hidden md:table-row font-bold">
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        #
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
      >
        {{ t('teams.team') }}
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        {{ t('games.played.short') }}
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        {{ t('games.won.short') }}
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        {{ t('games.lost.short') }}
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        {{ t('sets.in_favor.short') }}
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        {{ t('sets.against.short') }}
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        {{ t('points.in_favor.short') }}
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        {{ t('points.against.short') }}
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        {{ t('points.point', 2) }}
      </div>
    </div>

    <div
      v-for="row in classification"
      :key="row.teamId"
      class="easy-table-row table-row"
    >
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-1 md:hidden">#</span>
        <span>{{ getTeamPosition(row.teamId) }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
      >
        <span class="font-bold mr-1 md:hidden">
          {{ t('teams.team') }}
        </span>
        <span>{{ row.teamName }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-1 md:hidden">
          {{ t('games.played.short') }}
        </span>
        <span>{{ row.gamesCount }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-1 md:hidden">
          {{ t('games.won.short') }}
        </span>
        <span>{{ row.gamesWon }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-1 md:hidden">
          {{ t('games.lost.short') }}
        </span>
        <span>{{ row.gamesLost }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-1 md:hidden">
          {{ t('sets.in_favor.short') }}
        </span>
        <span>{{ row.setsWon }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-1 md:hidden">
          {{ t('sets.against.short') }}
        </span>
        <span>{{ row.setsLost }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-1 md:hidden">
          {{ t('points.in_favor.short') }}
        </span>
        <span>{{ row.pointsInFavor }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-1 md:hidden">
          {{ t('points.against.short') }}
        </span>
        <span>{{ row.pointsAgainst }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell md:border-solid border-0 md:border-b border-[var(--text-color)] md:border-[var(--input-border-color)] pt-2 pb-5 md:pb-2 px-1 text-center mb-3 md:mb-0 font-bold text-primary"
      >
        <span class="font-bold mr-1 md:hidden">
          {{ t('points.point', 2) }}
        </span>
        <span>{{ row.points }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LeagueClassificationTable',
}
</script>
