<script setup lang="ts">
import { Set } from '@/domain/set'
import { Team } from '@/domain/team'
import { Call } from '@/domain/call'
import { getTimeoutsByTeamId } from '@/domain/timeout'
import { Rotation } from '@/domain/rotation'
import { DurationScopes, mapDurationTo } from '@/domain/utils'

const props = defineProps({
  set: {
    type: Object as PropType<Set>,
    required: false,
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
})

const localTeamTimeoutsCount = computed((): number | undefined => {
  if (!props.set?.timeouts) return
  return getTimeoutsByTeamId(props.set?.timeouts, props.localTeam.id).length
})

const visitorTeamTimeoutsCount = computed((): number | undefined => {
  if (!props.set?.timeouts) return
  return getTimeoutsByTeamId(props.set?.timeouts, props.visitorTeam.id).length
})

const localTeamRotation = computed((): Rotation | undefined => {
  if (!props.set?.rotations) return
  return props.set.rotations.find(
    rotation => rotation.callId === props.localTeamCall.id,
  )
})

const visitorTeamRotation = computed((): Rotation | undefined => {
  if (!props.set?.rotations) return
  return props.set.rotations.find(
    rotation => rotation.callId === props.visitorTeamCall.id,
  )
})

const localTeamWinner = computed((): number => {
  return props.set?.winnerTeamId === props.localTeam.id ? 1 : 0
})

const visitorTeamWinner = computed((): number => {
  return props.set?.winnerTeamId === props.visitorTeam.id ? 1 : 0
})

const localTeamWonPointsCount = computed((): number | undefined => {
  return props.set?.localTeamScore
})

const visitorTeamWonPointsCount = computed((): number | undefined => {
  return props.set?.visitorTeamScore
})
</script>

<template>
  <div class="grid place-content-center p-2 border-solid border-r-0 border-t-0">
    <span>{{ localTeamTimeoutsCount }}</span>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <span>{{
      set
        ? localTeamRotation
          ? localTeamRotation?.playerChangesCount
          : 0
        : undefined
    }}</span>
  </div>

  <div class="grid place-content-center p-2 border-solid border-x-0 border-t-0">
    <span>{{ set ? localTeamWinner : undefined }}</span>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <span>{{ localTeamWonPointsCount }}</span>
  </div>

  <div
    class="grid grid-cols-2 place-content-center col-span-2 p-2 border-solid border-t-0 border-x-0 text-center h-[30.9px]"
  >
    <span class="uppercase">{{ set?.number }}</span>
    <span>{{
      set?.duration
        ? `${mapDurationTo(set.duration, DurationScopes.minutes)}"`
        : ' '
    }}</span>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <span>{{ visitorTeamWonPointsCount }}</span>
  </div>

  <div class="grid place-content-center p-2 border-solid border-x-0 border-t-0">
    <span>{{ set ? visitorTeamWinner : undefined }}</span>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <span>{{
      set
        ? visitorTeamRotation
          ? visitorTeamRotation?.playerChangesCount
          : 0
        : undefined
    }}</span>
  </div>

  <div class="grid place-content-center p-2 border-solid border-l-0 border-t-0">
    <span>{{ visitorTeamTimeoutsCount }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleResultItem',
}
</script>
