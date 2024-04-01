<script setup lang="ts">
import { Game } from '@/domain/game'
import { Division } from '@/domain/division'
import { Category } from '@/domain/game'
import { Gender } from '@/domain/game'
import { Court } from '@/domain/court'
import { Sede } from '@/domain/sede'
import { formatDate, formatTime } from '@/domain/utils'
import { Team } from '@/domain/team'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
  division: {
    type: Object as PropType<Division>,
    required: true,
  },
  category: {
    type: Object as PropType<Category>,
    required: true,
  },
  gender: {
    type: Object as PropType<Gender>,
    required: true,
  },
  sede: {
    type: Object as PropType<Sede>,
    required: true,
  },
  court: {
    type: Object as PropType<Court>,
    required: true,
  },
  localTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  visitorTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  leftSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  rightSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
})

const config = useRuntimeConfig()
</script>

<template>
  <header class="report-header flex border-solid">
    <div class="report-header-info p-4 flex-1 flex flex-col justify-between">
      <p class="report-competition text-2xl font-semibold">
        {{ division.name }}
      </p>
      <div>
        <p class="mb-2">
          <strong class="mr-1">{{ $t('forms.facility', 2) }}:</strong>
          <span>{{ sede.name }} ({{ court.name }})</span>
        </p>
        <p>
          <strong class="mr-1">{{ $t('categories.category') }}:</strong>
          <span>
            {{ $t(`categories.${category.name}`) }} -
            {{ $t(`genders.${gender.name}`) }}
          </span>
        </p>
      </div>
    </div>
    <div
      class="report-header-data border-solid border-y-0 p-4 flex-1 flex flex-col justify-between"
    >
      <div class="grid grid-cols-2 mb-2">
        <p class="report-date">
          <strong class="mr-1">{{ $t('forms.date') }}:</strong>
          <span v-if="game.date">{{ formatDate(game.date) }}</span>
        </p>
        <p class="report-time">
          <strong class="mr-1">{{ $t('forms.time') }}:</strong>
          <span v-if="game.date">{{ formatTime(game.date) }}</span>
        </p>
      </div>
      <div class="grid grid-cols-2 mb-2">
        <p class="report-local-team">
          <strong class="mr-1">{{ $t('teams.local') }}:</strong>
          <span>{{ localTeam.name }}</span>
        </p>
        <p class="report-visitor-team">
          <strong class="mr-1">{{ $t('teams.visitor') }}:</strong>
          <span>{{ visitorTeam.name }}</span>
        </p>
      </div>
      <div>
        <div class="report-teams grid grid-cols-2">
          <div class="report-team flex justify-start items-end">
            <p
              class="report-team-side text-5xl font-semibold mr-3 text-primary"
            >
              A
            </p>
            <p class="report-team-name text-xl leading-5 mb-1.5">
              {{ leftSideTeam.name }}
            </p>
          </div>
          <div class="report-team flex flex-row-reverse items-end">
            <p
              class="report-team-side text-5xl font-semibold ml-3 text-tertiary-dark"
            >
              B
            </p>
            <p class="report-team-name text-xl leading-5 mb-1.5">
              {{ rightSideTeam.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="report-header-easy py-4 px-12 flex justify-center items-center text-center flex-col"
    >
      <IconEasyLiga size="60" />
      <span class="text-xl font-semibold">{{ config.public.appName }}</span>
    </div>
  </header>
</template>
