<script setup lang="ts">
import { GameReportTeamTypes, GameReportTeamType } from '@/domain/game'
import { Sanction, SanctionType } from '@/domain/sanction'
import { SanctionType as ReportSanctionType } from '@/domain/report'
import { CallPlayerData } from '@/domain/call'
import { Profile } from '@/domain/profile'
import { Set } from '@/domain/set'
import { Team } from '@/domain/team'
import { getFullName } from '@/domain/player'

const props = defineProps({
  sanction: {
    type: Object as PropType<Sanction>,
    required: true,
  },
  sets: {
    type: Array as PropType<Set[]>,
    required: true,
  },
  players: {
    type: Array as PropType<CallPlayerData[]>,
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

const shirtNumber = computed((): number | string | undefined => {
  if (props.sanction.type === SanctionType.team) return ReportSanctionType.team
  if (props.sanction.coachProfileId) return ReportSanctionType.coach

  return props.players.find(
    player => player.profileId === props.sanction.playerProfileId,
  )?.shirtNumber
})

const profile = computed((): Profile | undefined => {
  if (props.sanction.type === SanctionType.team) return

  return props.sanction.coachProfileId
    ? props.sanction.coachProfile
    : props.sanction.playerProfile
})

const sanctionedTeam = computed((): Team => {
  return props.sanction.teamId === props.leftSideTeam.id
    ? props.leftSideTeam
    : props.rightSideTeam
})

const sanctionedName = computed((): string | undefined => {
  return profile.value ? getFullName(profile.value) : sanctionedTeam.value.name
})

const sanctionedTeamType = computed((): GameReportTeamType => {
  return props.sanction.teamId === props.leftSideTeam.id
    ? GameReportTeamTypes.A
    : GameReportTeamTypes.B
})

const setNumber = computed((): number | undefined => {
  return props.sets.find(set => set.id === props.sanction.setId)?.number
})
</script>

<template>
  <div
    class="col-span-4 p-2 flex gap-2 items-center border-solid border-t-0 border-r-0 h-[36.5px]"
  >
    <div class="grid place-content-center w-8">
      <SanctionItem :severity="sanction.severity" size="1rem" />
    </div>
    <IconShirtNumber class="no-print" :shirtNumber="shirtNumber" size="sm" />
    <div class="print text-center w-8 font-bold">
      {{ shirtNumber }}
    </div>
    <span>{{ sanctionedName }}</span>
  </div>
  <div
    class="grid place-content-center gap-1 p-2 border-solid border-t-0 border-x-0 h-[36.5px]"
  >
    <GameReportSimpleTeamIcon :type="sanctionedTeamType" />
  </div>
  <div
    class="grid place-content-center border-solid border-t-0 border-x-0 h-[36.5px]"
  >
    {{ setNumber }}
  </div>
  <div
    class="grid grid-cols-[1fr_auto_1fr] gap-1.5 place-content-center col-span-2 p-2 border-solid border-t-0 border-l-0 h-[36.5px]"
  >
    <span class="justify-self-end">{{ sanction.localTeamScore }}</span>
    <span>:</span>
    <span>{{ sanction.visitorTeamScore }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleSanctionItem',
}
</script>
