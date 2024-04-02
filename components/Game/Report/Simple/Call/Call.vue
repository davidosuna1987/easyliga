<script setup lang="ts">
import { Team, TeamMemberTypes } from '@/domain/team'
import { Call, CallPlayerData } from '@/domain/call'
import { Profile } from '@/domain/profile'
import { getFullName } from '@/domain/player'

const props = defineProps({
  calls: {
    type: Array as PropType<Call[]>,
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

const courtPlayersRowLength = computed((): number => {
  const max = Math.max(
    ...props.calls.map(call => call.playersData?.length ?? 0),
  )
  return max > 9 ? max : 9
})

const liberoPlayersRowLength: number = 2

const leftSideTeamCall = computed((): Call | undefined =>
  props.calls.find(call => call.teamId === props.leftSideTeam.id),
)

const rightSideTeamCall = computed((): Call | undefined =>
  props.calls.find(call => call.teamId === props.rightSideTeam.id),
)

const leftSideTeamCourtPlayers = computed((): CallPlayerData[] | undefined =>
  leftSideTeamCall.value?.playersData.filter(player => !player.libero),
)

const rightSideTeamCourtPlayers = computed((): CallPlayerData[] | undefined =>
  rightSideTeamCall.value?.playersData.filter(player => !player.libero),
)

const leftSideTeamLiberoPlayers = computed((): CallPlayerData[] | undefined =>
  leftSideTeamCall.value?.playersData.filter(player => !!player.libero),
)

const rightSideTeamLiberoPlayers = computed((): CallPlayerData[] | undefined =>
  rightSideTeamCall.value?.playersData.filter(player => !!player.libero),
)

const leftSideTeamCoach = computed(
  (): Profile | undefined => leftSideTeamCall.value?.coach?.profile,
)

const rightSideTeamCoach = computed(
  (): Profile | undefined => rightSideTeamCall.value?.coach?.profile,
)
</script>

<template>
  <aside class="easy-game-report-call-component">
    <div class="grid grid-cols-12">
      <GameReportSimpleCallHeader
        :localTeam="localTeam"
        :visitorTeam="visitorTeam"
        :leftSideTeam="leftSideTeam"
      />
      <div class="col-span-6 border-solid border-b-0 border-x-0">
        <GameReportSimpleCallPlayerList
          v-if="leftSideTeamCourtPlayers"
          :rowLength="courtPlayersRowLength"
          :players="leftSideTeamCourtPlayers"
        />
      </div>
      <div class="col-span-6 border-solid border-b-0 border-l-0">
        <GameReportSimpleCallPlayerList
          v-if="rightSideTeamCourtPlayers"
          :rowLength="courtPlayersRowLength"
          :players="rightSideTeamCourtPlayers"
        />
      </div>
      <GameReportSimpleCallLiberoHeader />
      <div class="col-span-6 border-solid border-b-0 border-x-0">
        <GameReportSimpleCallPlayerList
          v-if="leftSideTeamLiberoPlayers"
          :rowLength="liberoPlayersRowLength"
          :players="leftSideTeamLiberoPlayers"
        />
      </div>
      <div class="col-span-6 border-solid border-b-0 border-l-0">
        <GameReportSimpleCallPlayerList
          v-if="rightSideTeamLiberoPlayers"
          :rowLength="liberoPlayersRowLength"
          :players="rightSideTeamLiberoPlayers"
        />
      </div>
      <GameReportSimpleCallStaffHeader />
      <div class="col-span-12 border-solid">
        <div class="grid grid-cols-11 place-content-center">
          <div class="col-span-5 px-2 flex items-center">
            {{ getFullName(leftSideTeamCoach) }}
          </div>
          <div
            class="col-span-1 border-solid border-y-0 h-[29.5px] grid place-content-center"
          >
            <IconShirtNumber class="no-print" shirtNumber="E" size="sm" />
            <strong class="print">{{ TeamMemberTypes.COACH }}</strong>
          </div>
          <div class="col-span-5 px-2 flex items-center">
            {{ getFullName(rightSideTeamCoach) }}
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleCall',
}
</script>
