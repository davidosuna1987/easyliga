<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { Team, TeamMemberTypes } from '@/domain/team'
import { Call, CallPlayerData } from '@/domain/call'
import { Profile } from '@/domain/profile'
import { getFullName } from '@/domain/player'
import { MIN_CALL_PLAYERS_ROW_LENGTH } from '@/domain/report'

const props = defineProps({
  referee: {
    type: Object as PropType<Profile>,
    required: true,
  },
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

const auth = useAuthStore()

const localTeamCoachName = ref('')
const visitorTeamCoachName = ref('')
const editLocalTeamCoachName = ref(false)
const editVisitorTeamCoachName = ref(false)
const localTeamCoachNameInput = ref<HTMLInputElement>()
const visitorTeamCoachNameInput = ref<HTMLInputElement>()

const authUserCanEditLocalCoachName = computed(
  (): boolean =>
    !!auth.user &&
    (auth.hasAnyRole(['admin', 'staff']) ||
      auth.user.id === props.referee.userId),
)

const authUserCanEditVisitorCoachName = computed(
  (): boolean =>
    !!auth.user &&
    (auth.hasAnyRole(['admin', 'staff']) ||
      auth.user.id === props.referee.userId),
)

const courtPlayersRowLength = computed((): number => {
  const max = Math.max(
    ...props.calls.map(
      call => call.playersData?.filter(player => !player.libero).length ?? 0,
    ),
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

const handleEditLocalTeamCoachName = (): void => {
  editLocalTeamCoachName.value = !editLocalTeamCoachName.value

  if (editLocalTeamCoachName.value) {
    localTeamCoachName.value = getFullName(localTeamCoach.value) ?? ''
    nextTick(() => localTeamCoachNameInput.value?.focus())
  }
}

const handleEditVisitorTeamCoachName = (): void => {
  editVisitorTeamCoachName.value = !editVisitorTeamCoachName.value

  if (editVisitorTeamCoachName.value) {
    visitorTeamCoachName.value = getFullName(visitorTeamCoach.value) ?? ''
    nextTick(() => visitorTeamCoachNameInput.value?.focus())
  }
}
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
          <div class="col-span-5 px-2 flex justify-between items-center">
            <input
              v-if="authUserCanEditLocalCoachName && editLocalTeamCoachName"
              ref="localTeamCoachNameInput"
              v-model="localTeamCoachName"
              class="flex-1"
              type="text"
            />
            <span v-else>
              {{ getFullName(localTeamCoach) }}
            </span>
            <EasyIcon
              v-if="authUserCanEditLocalCoachName"
              class="no-print"
              :name="editLocalTeamCoachName ? 'times' : 'edit'"
              :button="editLocalTeamCoachName ? 'danger' : 'primary'"
              @click="handleEditLocalTeamCoachName"
            />
          </div>
          <div
            class="col-span-1 border-solid border-y-0 h-[29.5px] grid place-content-center"
          >
            <IconShirtNumber class="no-print" shirtNumber="E" size="sm" />
            <strong class="print">{{ TeamMemberTypes.COACH }}</strong>
          </div>
          <div class="col-span-5 px-2 flex justify-between items-center">
            <input
              v-if="authUserCanEditVisitorCoachName && editVisitorTeamCoachName"
              ref="visitorTeamCoachNameInput"
              v-model="visitorTeamCoachName"
              class="flex-1"
              type="text"
            />
            <span v-else>
              {{ getFullName(visitorTeamCoach) }}
            </span>
            <EasyIcon
              v-if="authUserCanEditVisitorCoachName"
              class="no-print"
              :name="editVisitorTeamCoachName ? 'times' : 'edit'"
              :button="editVisitorTeamCoachName ? 'danger' : 'primary'"
              @click="handleEditVisitorTeamCoachName"
            />
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
