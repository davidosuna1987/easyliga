<script setup lang="ts">
import { Team, TeamSide, TeamType, mapProfileToTeamMember } from '@/domain/team'
import { Set } from '@/domain/set'
import { Call, CallPlayerData } from '@/domain/call'
import { Rotation } from '@/domain/rotation'
import { Timeout, TimeoutStatusEnum } from '@/domain/timeout'
import { GameStatus } from '@/domain/game'
import { Player } from '@/domain/player'
import {
  Sanction,
  SanctionMember,
  SanctionMemberKey,
  SanctionSeverity,
  SanctionType,
  getPlayerItemSanction,
  mergeSanctionsRemovingDuplicates,
} from '@/domain/sanction'
import {
  GameSignature,
  GameSignatureStoreRequest,
  GameSignatureType,
  GameSignatureTypes,
  mapApiGameSignatureToGameSignature,
  mapGameSignatureStoreRequestToApiGameSignatureStoreRequest,
} from '@/domain/game-signature'
import GameSignatureService from '@/services/game-signature'
import { User } from '@/domain/user'

const props = defineProps({
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
  teamType: {
    type: String as PropType<TeamType>,
    required: true,
  },
  side: {
    type: String as PropType<TeamSide>,
    required: true,
  },
  coach: {
    type: Object as PropType<User>,
    required: false,
  },
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
  rotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  timeouts: {
    type: Array as PropType<Timeout[]>,
    required: false,
  },
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
  setSanctions: {
    type: Array as PropType<Sanction[]>,
    required: false,
  },
  gameSanctions: {
    type: Array as PropType<Sanction[]>,
    required: false,
  },
  gameStatus: {
    type: String as PropType<GameStatus>,
    required: true,
  },
  gameSignatures: {
    type: Array as PropType<GameSignature[]>,
    required: true,
  },
})

const emit = defineEmits([
  'call:unlocked',
  'rotation:lock-toggled',
  'timeout:start',
  'member:clicked',
  'signature:stored',
])

const { t } = useI18n()
const toast = useEasyToast()
const gameSignatureService = new GameSignatureService()

const selectedSignatureType = ref<GameSignatureType>()
const showSignatureDialog = ref<boolean>(false)
const loadingSignature = ref<boolean>(false)

const inCourtPlayers = computed((): CallPlayerData[] => {
  const inCourtPlayerIds = props.rotation?.players.map(
    rotation => rotation.inCourtProfileId,
  )

  return props.call.playersData.filter(player =>
    inCourtPlayerIds?.includes(player.profileId),
  )
})

const expelledPlayers = computed((): CallPlayerData[] => {
  const expelledPlayerIds = props.gameSanctions
    ?.filter(
      sanction =>
        sanction.type === SanctionType.member &&
        sanction.severity === SanctionSeverity.game &&
        sanction.teamId === props.team.id &&
        sanction.playerProfileId,
    )
    .map(sanction => sanction.playerProfileId)

  return props.call.playersData.filter(player =>
    expelledPlayerIds?.includes(player.profileId),
  )
})

const benchPlayers = computed((): CallPlayerData[] => {
  const inCourtPlayerIds = props.rotation?.players.map(
    rotation => rotation.inCourtProfileId,
  )

  const expelledPlayerIds = expelledPlayers.value.map(
    player => player.profileId,
  )

  return props.call.playersData.filter(
    player =>
      !inCourtPlayerIds?.includes(player.profileId) &&
      !expelledPlayerIds.includes(player.profileId),
  )
})

const requestedTimeout = computed((): Timeout | undefined =>
  props.timeouts?.find(
    timeout => timeout.status === TimeoutStatusEnum.requested,
  ),
)

const runningTimeout = computed((): Timeout | undefined =>
  props.timeouts?.find(timeout => timeout.status === TimeoutStatusEnum.running),
)

const rotationSanctions = computed((): Sanction[] => {
  const rotationSetSanctions = props.setSanctions ?? []

  const gameSanctions =
    props.gameSanctions?.filter(
      sanction =>
        sanction.type === SanctionType.member &&
        sanction.severity === SanctionSeverity.game &&
        sanction.teamId === props.team.id,
    ) ?? []

  return mergeSanctionsRemovingDuplicates(rotationSetSanctions, gameSanctions)
})

const getRotationMemberSanction = (
  player: Player | User,
  memberType: SanctionMemberKey = 'player',
): Sanction | undefined =>
  getPlayerItemSanction(
    rotationSanctions.value,
    props.currentSet.id,
    props.team.id,
    'profileId' in player ? player.profileId : player.id,
    memberType,
    'game',
  )

const handleStoreSignature = async (signature: GameSignatureStoreRequest) => {
  loadingSignature.value = true

  const { data, error } = await gameSignatureService.store(
    props.currentSet.gameId,
    mapGameSignatureStoreRequestToApiGameSignatureStoreRequest(signature),
  )

  loadingSignature.value = false

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  showSignatureDialog.value = false

  emit(
    'signature:stored',
    mapApiGameSignatureToGameSignature(data.value.data.game_signature),
  )
}

const handleOpenSignatureDialog = (gameSignatureType: GameSignatureType) => {
  selectedSignatureType.value = gameSignatureType
  showSignatureDialog.value = true
}
</script>

<template>
  <div class="easy-game-call-sidebar-component">
    <header class="sidebar-header flex justify-between mb-4">
      <Heading tag="h5" class="mb-1">
        {{ props.team.name }}
      </Heading>
      <DialogCloseButton
        @click="easyEmit('game-call-sidebar:close', props.side)"
      />
    </header>
    <main class="sidebar-content">
      <template v-if="gameStatus === 'finished' && gameSignatures.length < 5">
        <div class="flex flex-col gap-2">
          <Button
            v-for="gameSignatureType in [
              GameSignatureTypes.coach,
              GameSignatureTypes.captain,
            ]"
            class="flex-1"
            :label="t(`reports.signature_type.short.${gameSignatureType}`)"
            outlined
            :disabled="
              !!gameSignatures.find(
                signature =>
                  signature.type === gameSignatureType &&
                  signature.teamId === team.id,
              )
            "
            @click="handleOpenSignatureDialog(gameSignatureType)"
          />
        </div>

        <SignatureDialog
          v-if="selectedSignatureType"
          :visible="showSignatureDialog"
          :loading="loadingSignature"
          :save-inline="false"
          :type="selectedSignatureType"
          :team-type="teamType"
          :title="
            t(`reports.signature_type.long.${selectedSignatureType}`, {
              teamName: team.name,
            })
          "
          @hide="showSignatureDialog = false"
          @signature:created="handleStoreSignature"
        />
      </template>
      <template v-else>
        <template v-if="props.rotation && props.rotation.players.length === 6">
          <Heading tag="h6">{{ t('rotations.in_court') }}</Heading>
          <PlayerItem
            v-for="player in inCourtPlayers"
            :key="player.profileId"
            :class="{ 'pointer-events-none': props.gameStatus === 'finished' }"
            :player="player"
            :showIcons="false"
            :showCaptain="
              rotation?.inCourtCaptainProfileId === player.profileId
            "
            :showLibero="!!player.libero"
            :sanction="getRotationMemberSanction(player)"
            @click="emit('member:clicked', { player })"
          />
          <template v-if="benchPlayers.length">
            <Heading tag="h6">{{ t('rotations.bench') }}</Heading>
            <PlayerItem
              v-for="player in benchPlayers"
              :key="player.profileId"
              :class="{
                'pointer-events-none': props.gameStatus === 'finished',
              }"
              :player="player"
              :showIcons="false"
              :showCaptain="!!player.captain"
              :showLibero="!!player.libero"
              :sanction="getRotationMemberSanction(player)"
              @click="emit('member:clicked', { player })"
            />
          </template>
          <template v-if="expelledPlayers.length">
            <Heading class="mb-1" tag="h6">{{
              t('sanctions.expelled_player', 2)
            }}</Heading>
            <PlayerItem
              v-for="player in expelledPlayers"
              :key="player.profileId"
              class="pointer-events-none"
              :player="player"
              :showIcons="false"
              :showCaptain="!!player.captain"
              :showLibero="!!player.libero"
              :sanction="getRotationMemberSanction(player)"
              @click="emit('member:clicked', { player })"
            />
          </template>
          <template v-if="props.coach">
            <Heading tag="h6">{{ t('coaches.coach') }}</Heading>
            <CoachItem
              v-if="props.coach.profile"
              :coach="mapProfileToTeamMember(props.coach.profile, true)"
              :sanction="getRotationMemberSanction(props.coach, SanctionMember.coach as SanctionMemberKey)"
              @click="emit('member:clicked', { coach: props.coach })"
            />
          </template>
          <div class="rotation-status-area">
            <RefereeGameRotationStatus
              :rotation="props.rotation"
              :requestedTimeout="requestedTimeout"
              :runningTimeout="runningTimeout"
              :gameStatus="props.gameStatus"
              @rotation:lock-toggled="emit('rotation:lock-toggled', true)"
            />
          </div>
          <div v-if="!!requestedTimeout" class="rotation-timeout-requested">
            <Button
              class="w-full"
              severity="danger"
              :label="t('timeouts.init')"
              @click.prevent="emit('timeout:start', requestedTimeout)"
            />
          </div>
        </template>
        <template v-else>
          <Heading tag="h6">{{ t('calls.call') }}</Heading>
          <PlayerItem
            v-for="player in props.call.playersData"
            :key="player.profileId"
            :class="{ 'pointer-events-none': props.gameStatus === 'finished' }"
            :player="player"
            :showIcons="false"
            :showCaptain="!!player.captain"
            :showLibero="!!player.libero"
            :sanction="getRotationMemberSanction(player)"
            @click="emit('member:clicked', { player })"
          />
          <template v-if="props.coach">
            <Heading tag="h6">{{ t('coaches.coach') }}</Heading>
            <CoachItem
              v-if="props.coach.profile"
              :coach="mapProfileToTeamMember(props.coach.profile, true)"
              :sanction="getRotationMemberSanction(props.coach, SanctionMember.coach as SanctionMemberKey)"
              @click="emit('member:clicked', { coach: props.coach })"
            />
          </template>
          <div class="call-status-area p-[0.5rem]">
            <RefereeGameCallStatus
              :call="props.call"
              :currentSet="props.currentSet"
              :gameStatus="props.gameStatus"
              @call:unlocked="emit('call:unlocked', true)"
            />
          </div>
        </template>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameCallSidebar',
}
</script>
