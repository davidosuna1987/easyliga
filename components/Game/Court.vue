<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { Call, CallPlayerData } from '@/domain/call'
import { Player } from '@/domain/player'
import {
  CustomTeamsShirtColor,
  Team,
  TeamMember,
  TeamSide,
  TeamSideEnum,
  TeamType,
  mapCallPlayerDataToTeamMember,
  mapProfileToTeamMember,
} from '@/domain/team'
import { Set, SetSide } from '@/domain/set'
import {
  CurrentRotation,
  Rotation,
  POSITIONS,
  RotationPlayer,
} from '@/domain/rotation'
import { GAME_OBSERVATIONS_DELAY, GameStatus } from '@/domain/game'
import {
  EXPULSION_SEVERITIES,
  Sanction,
  SanctionMember,
  SanctionMemberKey,
  SanctionType,
  getPlayerItemSanction,
} from '@/domain/sanction'
import { Timeout } from '@/domain/timeout'
import { GameSignature } from '@/domain/game-signature'
import { Profile } from '@/domain/profile'
import moment from 'moment'

const props = defineProps({
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
  gameSanctions: {
    type: Array as PropType<Sanction[]>,
    required: false,
  },
  leftSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  rightSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  leftSideTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  rightSideTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  leftSideTeamRotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  rightSideTeamRotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  leftSideTeamCurrentRotation: {
    type: Object as PropType<CurrentRotation>,
    required: true,
  },
  rightSideTeamCurrentRotation: {
    type: Object as PropType<CurrentRotation>,
    required: true,
  },
  leftSideTeamTimeouts: {
    type: Array as PropType<Timeout[]>,
    required: false,
  },
  rightSideTeamTimeouts: {
    type: Array as PropType<Timeout[]>,
    required: false,
  },
  undoPointButtonDisabled: {
    type: Boolean,
    required: true,
  },
  undoLastPointCountdown: {
    type: Number,
    default: 0,
  },
  servingTeamId: {
    type: Number,
    required: false,
  },
  rotations: {
    type: Array as PropType<Rotation[]>,
    required: true,
  },
  gameStatus: {
    type: String as PropType<GameStatus>,
    required: false,
  },
  timeoutRunning: {
    type: Boolean,
    default: false,
  },
  gameEndedAt: {
    type: String,
    required: false,
  },
  gameSignatures: {
    type: Array as PropType<GameSignature[]>,
    required: true,
  },
  customTeamsShirtColor: {
    type: Object as PropType<CustomTeamsShirtColor>,
    required: true,
  },
  pendingPlayerChanges: {
    type: Array as PropType<RotationPlayer[]>,
    required: false,
  },
})

const emit = defineEmits([
  'game:start',
  'point:sum',
  'point:undo',
  'set:start',
  'observations:dialog',
  'countdown:ended',
  'timeout:init',
  'sanction:stored',
  'sidebar:toggle',
  'pendingPlayerChange:show',
])

const { t } = useI18n()
const auth = useAuthStore()

const showCountdown = ref<boolean>(false)
const sideTeamToSanction = ref<TeamSide>()
const memberToSanction = ref<TeamMember>()
const pendingGameSignatures = computed(() => props.gameSignatures.length < 5)

// const waitingForPlayerChanges = computed(() =>
//   props.rotations.some(rotation => !rotation.locked),
// )

const leftSideTeamMembers = computed((): TeamMember[] =>
  props.leftSideTeam.coach
    ? [
        ...props.leftSideTeamCall.playersData.map(
          mapCallPlayerDataToTeamMember,
        ),
        mapProfileToTeamMember(
          props.leftSideTeam.coach.profile as Profile,
          true,
        ),
      ]
    : props.leftSideTeamCall.playersData.map(mapCallPlayerDataToTeamMember),
)

const rightSideTeamMembers = computed((): TeamMember[] =>
  props.rightSideTeam.coach
    ? [
        ...props.rightSideTeamCall.playersData.map(
          mapCallPlayerDataToTeamMember,
        ),
        mapProfileToTeamMember(
          props.rightSideTeam.coach.profile as Profile,
          true,
        ),
      ]
    : props.rightSideTeamCall.playersData.map(mapCallPlayerDataToTeamMember),
)

const teamToSanction = computed((): Team | undefined => {
  switch (sideTeamToSanction.value) {
    case TeamSideEnum.left:
      return props.leftSideTeam
    case TeamSideEnum.right:
      return props.rightSideTeam
    default:
      return undefined
  }
})

const teamMembersToSanction = computed((): TeamMember[] => {
  switch (sideTeamToSanction.value) {
    case TeamSideEnum.left:
      return leftSideTeamMembers.value
    case TeamSideEnum.right:
      return rightSideTeamMembers.value
    default:
      return []
  }
})

const playersToBeReplacedForSanction = computed((): CallPlayerData[] => {
  const inCourtPlayerProfileIds = props.rotations
    ?.map(rotation => rotation.players)
    .flat()
    .map(player => player.inCourtProfileId)

  const inCourtPlayerProfileWithExpulsionSeveritySanctionIds =
    props.currentSet.sanctions
      ?.filter(
        sanction =>
          sanction.type === SanctionType.member &&
          EXPULSION_SEVERITIES.includes(sanction.severity) &&
          sanction.playerProfileId &&
          inCourtPlayerProfileIds?.includes(sanction.playerProfileId),
      )
      .map(sanction => sanction.playerProfileId)

  const callsPlayersData = [
    ...props.leftSideTeamCall.playersData,
    ...props.rightSideTeamCall.playersData,
  ]

  return callsPlayersData.filter(
    player =>
      inCourtPlayerProfileIds.includes(player.profileId) &&
      inCourtPlayerProfileWithExpulsionSeveritySanctionIds?.includes(
        player.profileId,
      ),
  )
})

const sumPoint = (type: TeamType) => {
  emit('point:sum', type)
}

const undoLastPoint = () => {
  emit('point:undo')
}

const getRotationPlayerDataAtPosition = (
  position: number,
  side: SetSide,
): Player | undefined => {
  const call =
    side === SetSide.LEFT ? props.leftSideTeamCall : props.rightSideTeamCall

  const sideRotation =
    side === SetSide.LEFT
      ? props.leftSideTeamRotation
      : props.rightSideTeamRotation

  const inCourtPlayer = sideRotation?.players.find(
    player => player.currentPosition === position,
  )

  const inCourtProfileId = inCourtPlayer?.inCourtProfileId
  const changeStatus = inCourtPlayer?.status

  const playerData = call.playersData?.find(
    player => player.profileId === inCourtProfileId,
  )

  return playerData ? { ...playerData, changeStatus } : undefined
}

const localTeam = computed(() =>
  props.currentSet.localTeamSide === SetSide.LEFT
    ? props.leftSideTeam
    : props.rightSideTeam,
)

const visitorTeam = computed(() =>
  props.currentSet.visitorTeamSide === SetSide.LEFT
    ? props.leftSideTeam
    : props.rightSideTeam,
)

const teams = computed(() => ({
  local: localTeam.value,
  visitor: visitorTeam.value,
}))

const leftSideTeamCurrentRotationPlayersData = computed(() =>
  Array.from({ length: 6 }, (_, i) => i + 1)
    .map(position => getRotationPlayerDataAtPosition(position, SetSide.LEFT))
    .filter(player => player !== null),
)

const rightSideTeamCurrentRotationPlayersData = computed(() =>
  Array.from({ length: 6 }, (_, i) => i + 1)
    .map(position => getRotationPlayerDataAtPosition(position, SetSide.RIGHT))
    .filter(player => player !== null),
)

const setActionsDisabled = computed(() => {
  return (
    props.rotations?.length !== 2 ||
    props.rotations?.some(rotation => rotation.players.length < 6)
  )
})

const gameObservationsCountdownTarget = computed((): number =>
  props.gameEndedAt
    ? moment(props.gameEndedAt)
        .add(GAME_OBSERVATIONS_DELAY, 'minutes')
        .valueOf()
    : 0,
)

const onCountdownEnded = () => {
  showCountdown.value = false
  emit('countdown:ended')
}

const setInitialShowCountdown = () => {
  showCountdown.value =
    !!props.gameEndedAt && gameObservationsCountdownTarget.value > Date.now()
}

const setMemberToSanction = (side: TeamSide, player?: Player) => {
  sideTeamToSanction.value = side

  const teamToSanctionMembers =
    side === TeamSideEnum.left
      ? leftSideTeamMembers.value
      : rightSideTeamMembers.value

  memberToSanction.value = teamToSanctionMembers.find(
    member => member.profileId === player?.profileId,
  )
}

const getPlayerSanction = (
  side: TeamSide,
  player?: Player,
): Sanction | undefined => {
  if (!player) return undefined

  const playerTeam =
    side === TeamSideEnum.left ? props.leftSideTeam : props.rightSideTeam

  return getPlayerItemSanction(
    props.currentSet.sanctions,
    props.currentSet.id,
    playerTeam.id,
    player.profileId,
    SanctionMember.player as SanctionMemberKey,
  )
}

onMounted(setInitialShowCountdown)
</script>

<template>
  <div class="easy-game-court-component">
    <div v-if="gameStatus !== 'finished'" class="wrapper mb-5">
      <div class="court">
        <div class="side left">
          <GameCourtPosition
            v-for="position in POSITIONS"
            :key="position"
            :position="position"
            :player="leftSideTeamCurrentRotationPlayersData[position - 1]"
            :serving="position === 1 && servingTeamId === leftSideTeam.id"
            :captainProfileId="leftSideTeamRotation?.inCourtCaptainProfileId"
            :color="customTeamsShirtColor.left"
            :sanction="
              getPlayerSanction(
                TeamSideEnum.left,
                leftSideTeamCurrentRotationPlayersData[position - 1],
              )
            "
            @click="
              setMemberToSanction(
                TeamSideEnum.left,
                leftSideTeamCurrentRotationPlayersData[position - 1],
              )
            "
          />
        </div>
        <div class="side right">
          <GameCourtPosition
            v-for="position in POSITIONS"
            :key="position"
            :position="position"
            :player="rightSideTeamCurrentRotationPlayersData[position - 1]"
            :serving="position === 1 && servingTeamId === rightSideTeam.id"
            :captainProfileId="rightSideTeamRotation?.inCourtCaptainProfileId"
            :color="customTeamsShirtColor.right"
            :sanction="
              getPlayerSanction(
                TeamSideEnum.right,
                rightSideTeamCurrentRotationPlayersData[position - 1],
              )
            "
            @click="
              setMemberToSanction(
                TeamSideEnum.right,
                rightSideTeamCurrentRotationPlayersData[position - 1],
              )
            "
          />
        </div>
      </div>
    </div>

    <template v-if="auth.isAdminOrHasRole('referee')">
      <EasyGrid v-if="!gameStatus" class="actions" center>
        <Button
          class="px-12"
          :label="t('games.unlock')"
          @click.prevent="emit('game:start')"
        />
      </EasyGrid>
      <template v-else>
        <template
          v-if="
            playersToBeReplacedForSanction.length ||
            // waitingForPlayerChanges ||
            timeoutRunning
          "
        >
          <EasyGrid
            v-if="playersToBeReplacedForSanction.length"
            class="actions"
            center
          >
            <Button
              class="px-12 mb-3"
              :label="t('sanctions.players_to_replace')"
              severity="danger"
              outlined
              :disabled="true"
            />
          </EasyGrid>
          <!-- <EasyGrid v-if="waitingForPlayerChanges" class="actions" center>
            <Button
              class="px-12 mb-3"
              :label="t('rotations.waiting_player_changes')"
              outlined
              :loading="true"
              :disabled="true"
            />
          </EasyGrid> -->
          <EasyGrid v-if="timeoutRunning" class="actions" center>
            <Button
              class="px-12 mb-3"
              :label="t('timeouts.running')"
              severity="danger"
              outlined
              :loading="true"
              :disabled="true"
            />
          </EasyGrid>
        </template>
        <template v-else>
          <GameSetActions
            v-if="
              !currentSet.localTeamSide ||
              !currentSet.visitorTeamSide ||
              !currentSet.firstServeTeamId ||
              (gameStatus && ['warmup', 'resting'].includes(gameStatus))
            "
            class="mb-3"
            :currentSet="currentSet"
            :leftSideTeam="leftSideTeam"
            :rightSideTeam="rightSideTeam"
            :disabled="setActionsDisabled"
            @set:start="emit('set:start', $event)"
          />
          <div class="flex flex-col gap-8">
            <GameChangesActions
              v-if="gameStatus === 'playing'"
              class="w-full mb-3"
              :leftSideTeamCall="leftSideTeamCall"
              :rightSideTeamCall="rightSideTeamCall"
              :leftSideTeamRotation="leftSideTeamRotation"
              :rightSideTeamRotation="rightSideTeamRotation"
              :pendingPlayerChanges="pendingPlayerChanges"
              @pendingPlayerChange:show="
                emit('pendingPlayerChange:show', $event)
              "
            />
            <GamePointActions
              v-if="gameStatus === 'playing'"
              class="w-full mb-3"
              :currentSet="currentSet"
              :undoPointButtonDisabled="undoPointButtonDisabled"
              :undoLastPointCountdown="undoLastPointCountdown"
              @point:sum="sumPoint"
              @point:undo="undoLastPoint"
            />
            <GameTimeoutSanctionActions
              v-if="gameStatus !== 'finished'"
              class="mt-6 mb-3"
              :leftSideTeam="leftSideTeam"
              :rightSideTeam="rightSideTeam"
              :leftSideTeamMembers="leftSideTeamMembers"
              :rightSideTeamMembers="rightSideTeamMembers"
              :leftSideTeamTimeouts="leftSideTeamTimeouts ?? []"
              :rightSideTeamTimeouts="rightSideTeamTimeouts ?? []"
              :currentSet="currentSet"
              :gameSanctions="props.gameSanctions"
              :gameStatus="gameStatus"
              @timeout:init="emit('timeout:init', $event)"
              @sanction:stored="emit('sanction:stored', $event)"
              @sidebar:toggle="emit('sidebar:toggle', $event)"
            />
          </div>
          <EasyGrid v-if="gameStatus === 'finished'" class="actions" center>
            <GameSignatureActions
              v-if="pendingGameSignatures"
              :gameId="currentSet.gameId"
              :gameSignatures="gameSignatures"
              :teams="teams"
            />
            <Button
              v-else
              class="px-12 mb-3"
              :label="t('games.finished')"
              outlined
              disabled
            />
          </EasyGrid>
        </template>
      </template>

      <a
        v-if="gameStatus !== 'finished' || showCountdown"
        href=""
        class="w-full text-center block mt-5 mb-3 text-primary"
        @click.prevent="emit('observations:dialog')"
      >
        {{ t('observations.record') }}
      </a>

      <EasyCountdown
        v-if="gameStatus === 'finished' && showCountdown"
        class="col-span-3"
        :target="gameObservationsCountdownTarget"
        v-slot="{ minutes, seconds }"
        @countdown:ended="onCountdownEnded"
      >
        <div
          class="text-xs text-[var(--danger-color)] flex items-center justify-center"
        >
          {{ t('observations.countdown') }}
          <pre class="text-xs ml-2">{{ minutes }}:{{ seconds }}</pre>
        </div>
      </EasyCountdown>

      <SanctionDialog
        v-if="teamToSanction && memberToSanction"
        :visible="!!teamToSanction"
        :type="SanctionType.member"
        :team="teamToSanction"
        :currentSet="currentSet"
        :sanctions="props.currentSet.sanctions"
        :member="memberToSanction"
        :members="teamMembersToSanction"
        @sanction:stored="emit('sanction:stored', $event)"
        @hide="sideTeamToSanction = undefined"
      />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCourt',
}
</script>
