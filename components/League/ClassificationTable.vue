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
        <span v-tooltip.top="t('teams.position')">#</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
      >
        <span v-tooltip.top="t('teams.team')">{{ t('teams.team') }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span v-tooltip.top="t('games.played.long')">
          {{ t('games.played.short') }}
        </span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span v-tooltip.top="t('games.won.long')">
          {{ t('games.won.short') }}
        </span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span v-tooltip.top="t('games.lost.long')">
          {{ t('games.lost.short') }}
        </span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span v-tooltip.top="t('sets.in_favor.long')">
          {{ t('sets.in_favor.short') }}
        </span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span v-tooltip.top="t('sets.against.long')">
          {{ t('sets.against.short') }}
        </span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span v-tooltip.top="t('points.in_favor.long')">
          {{ t('points.in_favor.short') }}
        </span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span v-tooltip.top="t('points.against.long')">
          {{ t('points.against.short') }}
        </span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span v-tooltip.top="t('points.point', 2)">
          {{ t('points.point', 2) }}
        </span>
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
        <span class="font-bold mr-3 md:hidden">{{ t('teams.position') }}:</span>
        <span>{{ getTeamPosition(row.teamId) }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
      >
        <span class="font-bold mr-3 md:hidden"> {{ t('teams.team') }}: </span>
        <span>{{ row.teamName }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-3 md:hidden">
          {{ t('games.played.long') }}:
        </span>
        <span>{{ row.gamesCount }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-3 md:hidden">
          {{ t('games.won.long') }}:
        </span>
        <span>{{ row.gamesWon }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-3 md:hidden">
          {{ t('games.lost.long') }}:
        </span>
        <span>{{ row.gamesLost }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-3 md:hidden">
          {{ t('sets.in_favor.long') }}:
        </span>
        <span>{{ row.setsWon }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-3 md:hidden">
          {{ t('sets.against.long') }}:
        </span>
        <span>{{ row.setsLost }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-3 md:hidden">
          {{ t('points.in_favor.long') }}:
        </span>
        <span>{{ row.pointsInFavor }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1 text-center"
      >
        <span class="font-bold mr-3 md:hidden">
          {{ t('points.against.long') }}:
        </span>
        <span>{{ row.pointsAgainst }}</span>
      </div>
      <div
        class="easy-table-cell flex justify-between md:table-cell md:border-solid border-0 md:border-b border-[var(--text-color)] md:border-[var(--input-border-color)] pt-2 pb-5 md:pb-2 px-1 text-center mb-3 md:mb-0 font-bold text-primary"
      >
        <span class="font-bold mr-3 md:hidden">
          {{ t('points.point', 2) }}:
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
