<script setup lang="ts">
import { Team, TeamMemberTypes } from '@/domain/team'
import { Call, CallPlayerData } from '@/domain/call'
import { Profile } from '@/domain/profile'
import { getFullName } from '@/domain/player'
import { MIN_CALL_PLAYERS_ROW_LENGTH } from '@/domain/report'

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
})

const courtPlayersRowLength = computed((): number => {
  const max = Math.max(
    ...props.calls.map(call => call.playersData?.length ?? 0),
  )
  return max > MIN_CALL_PLAYERS_ROW_LENGTH ? max : MIN_CALL_PLAYERS_ROW_LENGTH
})

const liberoPlayersRowLength: number = 2

const localTeamCall = computed((): Call | undefined =>
  props.calls.find(call => call.teamId === props.localTeam.id),
)

const visitorTeamCall = computed((): Call | undefined =>
  props.calls.find(call => call.teamId === props.visitorTeam.id),
)

const localTeamCourtPlayers = computed((): CallPlayerData[] | undefined =>
  localTeamCall.value?.playersData.filter(player => !player.libero),
)

const visitorTeamCourtPlayers = computed((): CallPlayerData[] | undefined =>
  visitorTeamCall.value?.playersData.filter(player => !player.libero),
)

const localTeamLiberoPlayers = computed((): CallPlayerData[] | undefined =>
  localTeamCall.value?.playersData.filter(player => !!player.libero),
)

const visitorTeamLiberoPlayers = computed((): CallPlayerData[] | undefined =>
  visitorTeamCall.value?.playersData.filter(player => !!player.libero),
)

const localTeamCoach = computed(
  (): Profile | undefined => localTeamCall.value?.coach?.profile,
)

const visitorTeamCoach = computed(
  (): Profile | undefined => visitorTeamCall.value?.coach?.profile,
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
          v-if="localTeamCourtPlayers"
          :rowLength="courtPlayersRowLength"
          :players="localTeamCourtPlayers"
        />
      </div>
      <div class="col-span-6 border-solid border-b-0 border-l-0">
        <GameReportSimpleCallPlayerList
          v-if="visitorTeamCourtPlayers"
          :rowLength="courtPlayersRowLength"
          :players="visitorTeamCourtPlayers"
        />
      </div>
      <GameReportSimpleCallLiberoHeader />
      <div class="col-span-6 border-solid border-b-0 border-x-0">
        <GameReportSimpleCallPlayerList
          v-if="localTeamLiberoPlayers"
          :rowLength="liberoPlayersRowLength"
          :players="localTeamLiberoPlayers"
        />
      </div>
      <div class="col-span-6 border-solid border-b-0 border-l-0">
        <GameReportSimpleCallPlayerList
          v-if="visitorTeamLiberoPlayers"
          :rowLength="liberoPlayersRowLength"
          :players="visitorTeamLiberoPlayers"
        />
      </div>
      <GameReportSimpleCallStaffHeader />
      <div class="col-span-12 border-solid">
        <div class="grid grid-cols-11 place-content-center">
          <div class="col-span-5 px-2 flex items-center">
            {{ getFullName(localTeamCoach) }}
          </div>
          <div
            class="col-span-1 border-solid border-y-0 h-[29.5px] grid place-content-center"
          >
            <IconShirtNumber class="no-print" shirtNumber="E" size="sm" />
            <strong class="print">{{ TeamMemberTypes.COACH }}</strong>
          </div>
          <div class="col-span-5 px-2 flex items-center">
            {{ getFullName(visitorTeamCoach) }}
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
