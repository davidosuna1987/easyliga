<script setup lang="ts">
import { Set } from '@/domain/set'
import { Team } from '@/domain/team'
import { Rotation, getRotationsByCallId } from '@/domain/rotation'
import { Call } from '@/domain/call'
import { Game } from '@/domain/game'
import { Timeout, getTimeoutsByTeamId } from '@/domain/timeout'
import {
  Duration,
  formatTime,
  sumDurations,
  formatDuration,
} from '@/domain/utils'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
  sets: {
    type: Array as PropType<Set[]>,
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
  localTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  visitorTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  winnerTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
})

const gameTimeouts = computed((): Timeout[] => {
  return props.sets.flatMap(set => set.timeouts ?? [])
})

const localTeamTimeoutsCount = computed((): number => {
  return getTimeoutsByTeamId(gameTimeouts.value, props.localTeam.id).length
})

const visitorTeamTimeoutsCount = computed((): number => {
  return getTimeoutsByTeamId(gameTimeouts.value, props.visitorTeam.id).length
})

const gameRotations = computed((): Rotation[] => {
  return props.sets.flatMap(set => set.rotations ?? [])
})

const localTeamRotation = computed((): Rotation[] => {
  return getRotationsByCallId(gameRotations.value, props.localTeamCall.id)
})

const visitorTeamRotation = computed((): Rotation[] => {
  return getRotationsByCallId(gameRotations.value, props.visitorTeamCall.id)
})

const localTeamPlayerChangesCount = computed((): number => {
  return (
    localTeamRotation.value?.reduce((acc, rotation) => {
      return acc + rotation.playerChangesCount ?? 0
    }, 0) ?? 0
  )
})

const visitorTeamPlayerChangesCount = computed((): number => {
  return (
    visitorTeamRotation.value?.reduce((acc, rotation) => {
      return acc + rotation.playerChangesCount ?? 0
    }, 0) ?? 0
  )
})

const localTeamSetsWonCount = computed((): number => {
  return props.sets.filter(set => set.winnerTeamId === props.localTeam.id)
    .length
})

const visitorTeamSetsWonCount = computed((): number => {
  return props.sets.filter(set => set.winnerTeamId === props.visitorTeam.id)
    .length
})

const localTeamWonPointsCount = computed((): number => {
  return props.sets.reduce((acc, set) => {
    return acc + (set.localTeamScore ?? 0)
  }, 0)
})

const visitorTeamWonPointsCount = computed((): number => {
  return props.sets.reduce((acc, set) => {
    return acc + (set.visitorTeamScore ?? 0)
  }, 0)
})

const gameStart = computed((): string | undefined => {
  if (!!props.game?.start) return props.game.start
  if (!!props.sets[0]?.start) return props.sets[0].start
  return undefined
})

const gameEnd = computed((): string | undefined => {
  if (!!props.game?.end) return props.game.end
  if (!!props.sets[props.sets.length - 1]?.end)
    return props.sets[props.sets.length - 1].end
  return undefined
})

const setsDuration = computed((): Duration | undefined => {
  if (props.sets.length === 0) return
  return sumDurations(
    props.sets.map(set => set.duration ?? { hours: 0, minutes: 0, seconds: 0 }),
  )
})

const gameDuration = computed((): Duration | undefined => {
  if (props.game.duration) return props.game.duration
  return setsDuration.value
})
</script>

<template>
  <div class="grid place-content-center p-2 border-solid border-r-0">
    <strong>{{ localTeamTimeoutsCount }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid">
    <strong>{{ localTeamPlayerChangesCount }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-x-0">
    <strong>{{ localTeamSetsWonCount }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid">
    <strong>{{ localTeamWonPointsCount }}</strong>
  </div>

  <div
    class="flex flex-col justify-center items-center col-span-2 border-solid border-x-0 text-center"
  >
    <span class="font-2xs">{{ $t('reports.result.total_duration') }}</span>
    <strong>
      {{ setsDuration ? formatDuration(setsDuration) : '—' }}
    </strong>
  </div>

  <div class="grid place-content-center p-2 border-solid">
    <strong>{{ visitorTeamWonPointsCount }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-x-0">
    <strong>{{ visitorTeamSetsWonCount }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid">
    <strong>{{ visitorTeamPlayerChangesCount }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-l-0">
    <strong>{{ visitorTeamTimeoutsCount }}</strong>
  </div>

  <div class="col-span-10 grid grid-cols-3">
    <div class="flex flex-col justify-center items-center border-solid p-1">
      <span class="font-2xs">{{ $t('reports.result.start_time') }}</span>
      <span v-if="gameStart">{{ formatTime(gameStart) }}</span>
    </div>
    <div
      class="flex flex-col justify-center items-center border-solid border-x-0 p-1"
    >
      <span class="font-2xs">{{ $t('reports.result.end_time') }}</span>
      <span v-if="gameEnd">{{ formatTime(gameEnd) }}</span>
    </div>
    <div class="flex flex-col justify-center items-center border-solid p-1">
      <span class="font-2xs">{{ $t('reports.result.total_duration') }}</span>
      <span>{{ gameDuration ? formatDuration(gameDuration) : '—' }}</span>
    </div>
  </div>

  <div class="col-span-10 flex justify-between border-solid py-2 px-4">
    <div class="flex-min text-center">
      <strong class="uppercase">{{ $t('reports.result.winner') }}</strong>
    </div>
    <div class="text-center flex-1">
      <span>{{ winnerTeam.name }}</span>
    </div>
    <div class="flex gap-2 flex-min text-center">
      <strong>{{ localTeamSetsWonCount }}</strong>
      <span>:</span>
      <span>{{ visitorTeamSetsWonCount }}</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleResultFooter',
}
</script>
