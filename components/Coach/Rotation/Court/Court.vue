<script setup lang="ts">
import { Call, CallPlayerData, getPlayerDataByProfileId } from '@/domain/call'
import { Set } from '@/domain/set'
import {
  ATTACK_POSITIONS,
  ChangeType,
  MAX_ROTATION_PLAYER_CHANGES,
  PlayerChangeInOut,
  ROTATION_PLAYER_STATUS,
  RotationPlayer,
  RotationPlayerChangeRequest,
  RotationPlayerDeniedChange,
  mapApiRotationToRotation,
  mapPlayerChangeToChangeType,
} from '@/domain/rotation'
import { Rotation, POSITIONS } from '@/domain/rotation'
import { Player, getFullName, mapCallPlayerDataToPlayer } from '@/domain/player'
import {
  EXPULSION_SEVERITIES,
  Sanction,
  SanctionMember,
  SanctionMemberKey,
  SanctionSeverity,
  SanctionType,
  getPlayerItemSanction,
  isMembeSanction,
  mergeSanctionsRemovingDuplicates,
} from '@/domain/sanction'
import { GridBreakpoints } from '@/domain/grid'
import {
  ApiEvents,
  ApiGamePlayerRotationStatusUpdatedEventResponse,
} from '@/types/api/event'

const props = defineProps({
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
  currentSet: {
    type: Object as PropType<Set>,
    required: false,
  },
  rotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  initialRotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  isInitialRotationAssignment: {
    type: Boolean,
    required: true,
  },
  sanctions: {
    type: Array as PropType<Sanction[]>,
    required: false,
  },
  gameSanctions: {
    type: Array as PropType<Sanction[]>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'update:players', value: RotationPlayer[]): void
  (e: 'update:captain', value: number): void
  (e: 'change:players', value: RotationPlayerChangeRequest[]): void
  (e: 'playerRotationStatusUpdated', value: Rotation): void
}>()

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()

const listenedEvents = ref<string[]>([])
const rotationPlayers = ref<RotationPlayer[]>([])
const selectedPosition = ref<number | null>(null)
const selectedRotationInCourtCaptain = ref<RotationPlayer>()
const showCaptainSelector = ref(false)
const showUndoPlayerChange = ref(false)
const playerChangeToUndo = ref<RotationPlayerChangeRequest>()
const initialPlayerChangeToUndo = ref<RotationPlayerChangeRequest>()
const playerChangeApprovedOrDenied = ref<PlayerChangeInOut>()
const showDenyReasonDialog = ref<RotationPlayerChangeRequest>()

const playerChanges = ref<RotationPlayerChangeRequest[]>([])
const initialPlayerChanges = ref<RotationPlayerChangeRequest[]>([])

const callCaptain = computed(() =>
  props.call.playersData.find(player => player.captain),
)

const totalPlayerChanges = computed(
  () => playerChanges.value.length + (props.rotation?.playerChangesCount ?? 0),
)

const isTeamMembeSanction = (sanction: Sanction): boolean =>
  isMembeSanction(sanction) && sanction.teamId === props.call.teamId

const memberSanctions = computed((): Sanction[] => {
  const setSanctions = props.sanctions?.filter(isTeamMembeSanction) ?? []
  const gameSanctions = props.gameSanctions?.filter(isTeamMembeSanction) ?? []

  return mergeSanctionsRemovingDuplicates(setSanctions, gameSanctions)
})

const expulsionSanctions = computed((): Sanction[] =>
  memberSanctions.value.filter(
    sanction =>
      sanction.severity === SanctionSeverity.game ||
      (sanction.severity === SanctionSeverity.set &&
        sanction.setId === props.currentSet?.id),
  ),
)

const benchPlayers = computed((): CallPlayerData[] =>
  props.call.playersData.filter(
    player =>
      !player.libero &&
      !rotationPlayers.value
        .map(rp => rp.profileId)
        .includes(player.profileId) &&
      !rotationPlayers.value
        .map(rp => rp.replacementProfileId)
        .includes(player.profileId),
  ),
)

const availableBenchPlayers = computed((): CallPlayerData[] =>
  benchPlayers.value.filter(
    player =>
      !expulsionSanctions.value
        ?.map(sanction => sanction.playerProfileId)
        .includes(player.profileId),
  ),
)

const expelledPlayers = computed((): CallPlayerData[] =>
  benchPlayers.value.filter(player =>
    expulsionSanctions.value
      ?.map(sanction => sanction.playerProfileId)
      .includes(player.profileId),
  ),
)

const selectableCaptainPlayers = computed(() =>
  props.call.playersData.filter(
    player =>
      !player.libero &&
      rotationPlayers.value
        .map(rp => rp.inCourtProfileId)
        .includes(player.profileId) &&
      player.profileId !== selectedRotationInCourtCaptain.value?.profileId &&
      player.profileId !==
        selectedRotationInCourtCaptain.value?.inCourtProfileId,
  ),
)

const selectedCaptain = computed(() =>
  props.call.playersData.find(
    player =>
      player.profileId ===
      selectedRotationInCourtCaptain.value?.inCourtProfileId,
  ),
)

const liberoPlayers = computed(() =>
  props.call.playersData.filter(player => player.libero),
)

const playerToReplace = computed(() => {
  const rotationPlayer = rotationPlayers.value.find(
    rp => rp.currentPosition === selectedPosition.value,
  )
  return props.call.playersData.find(
    p => p.profileId === rotationPlayer?.profileId,
  )
})

const canChangeCaptain = computed(
  () =>
    (props.isInitialRotationAssignment &&
      (!selectedCaptain.value ||
        selectedCaptain.value.profileId !== callCaptain.value?.profileId)) ||
    (!selectedCaptain.value?.captain &&
      selectableCaptainPlayers.value.every(player => !player.captain) &&
      selectedRotationInCourtCaptain.value &&
      !!selectableCaptainPlayers.value.length &&
      !props.rotation?.locked &&
      props.rotation?.requestedInCourtCaptainProfileId !==
        selectedCaptain.value?.profileId &&
      props.initialRotation?.inCourtCaptainProfileId !==
        selectedCaptain.value?.profileId),
)

const gameTeamSanctions = computed((): Sanction[] | undefined =>
  props.gameSanctions?.filter(
    sanction =>
      sanction.type === SanctionType.member &&
      sanction.teamId === props.call.teamId,
  ),
)

const initialRotationPlayersToBeReplacedForSanction = computed(
  (): CallPlayerData[] => {
    const playerIdsToBeReplaced = gameTeamSanctions.value
      ?.filter(sanction => {
        const inCourtProfileIds = rotationPlayers.value?.map(
          player => player.inCourtProfileId,
        )

        return (
          sanction.playerProfileId &&
          inCourtProfileIds?.includes(sanction.playerProfileId ?? 0)
        )
      })
      .map(sanction => sanction.playerProfileId)

    return (
      props.call?.playersData.filter(player =>
        playerIdsToBeReplaced?.includes(player.profileId),
      ) ?? []
    )
  },
)

const submitLabel = computed((): string =>
  !!initialPlayerChangeToUndo.value &&
  playerChangeToUndo.value?.inCourtProfileId ===
    initialPlayerChangeToUndo.value.inCourtProfileId
    ? t('rotations.do_player_change')
    : t('rotations.cancel_player_change'),
)

const breakpoints = computed((): GridBreakpoints | undefined =>
  !!playerChanges.value.length || deniedPlayerChanges.value.length
    ? { lg: 2 }
    : undefined,
)

const isCaptainBeingReplaced = computed(
  (): boolean =>
    !!playerChanges.value.find(
      pc =>
        pc.profileId === selectedCaptain.value?.profileId &&
        pc.inCourtProfileId !== selectedCaptain.value?.profileId,
    ),
)

const deniedPlayerChanges = computed((): RotationPlayerDeniedChange[] =>
  rotationPlayers.value
    .flatMap(player => player.deniedChanges)
    .filter(change => !!change)
    .sort(
      (a, b) => new Date(a.deniedAt).getTime() - new Date(b.deniedAt).getTime(),
    ),
)

const setRotationPlayersFromRtotation = () => {
  playerChanges.value = []

  if (!props.initialRotation?.players) return

  for (const i in props.initialRotation.players) {
    const player = props.initialRotation.players[i]
    if (!player.replacementProfileId) continue

    playerChanges.value.push({
      id: player.id,
      profileId: player.profileId,
      replacementProfileId: player.replacementProfileId,
      inCourtProfileId: player.inCourtProfileId,
      position: player.currentPosition,
      status: player.status,
      libero: player.libero,
      changeWindows: player.changeWindows,
      comesFromApi: true,
    })

    initialPlayerChanges.value = JSON.parse(JSON.stringify(playerChanges.value))
  }
}

const handleAutoRotation = () => {
  if (!props.call.playersData.length) return

  const players = props.call.playersData.filter(player => !player.libero)

  for (let i = 0; i < 6; i++) {
    const player = players[i]

    if (!player) return

    rotationPlayers.value.push({
      id: 0,
      rotationId: 0,
      profileId: player.profileId,
      replacementProfileId: undefined,
      inCourtProfileId: player.profileId,
      currentPosition: POSITIONS[i],
      position: POSITIONS[i],
      status: ROTATION_PLAYER_STATUS.approved,
      libero: false,
      changeWindows: [],
    })
  }

  const rotationPlayerCaptain = rotationPlayers.value.find(
    rp => rp.inCourtProfileId === callCaptain.value?.profileId,
  )

  if (rotationPlayerCaptain) {
    setRotationCaptain(rotationPlayerCaptain.inCourtProfileId)
  } else {
    setRotationCaptain(rotationPlayers.value[0].inCourtProfileId)
  }

  emit('update:players', rotationPlayers.value)
}

const hideUndoPlayerChangeDialog = () => {
  showUndoPlayerChange.value = false
  playerChangeToUndo.value = undefined
  initialPlayerChangeToUndo.value = undefined
}

const setRotationCaptain = (profileId: number) => {
  selectedRotationInCourtCaptain.value = rotationPlayers.value.find(
    rp => rp.inCourtProfileId === profileId,
  )

  emit(
    'update:captain',
    selectedRotationInCourtCaptain.value?.inCourtProfileId ?? 0,
  )

  showCaptainSelector.value = false
}

const selectPosition = (position: number) => {
  if (!props.isInitialRotationAssignment) {
    const playerChangeInPosition = playerChanges.value.find(
      pc => pc.position === position,
    )

    if (!!playerChangeInPosition) {
      setPlayerChangeToUndo(playerChangeInPosition)
      return
    }
  }

  selectedPosition.value = position
}

const setPlayerChangeToUndo = (playerChange: RotationPlayerChangeRequest) => {
  playerChangeToUndo.value = playerChange

  const initialPlayerChange = initialPlayerChanges.value.find(
    pc => pc.profileId === playerChange.profileId,
  )

  initialPlayerChangeToUndo.value = initialPlayerChange
  showUndoPlayerChange.value = true
}

const removeUnchangedPlayerChanges = (
  playerChanges: RotationPlayerChangeRequest[],
) =>
  playerChanges.filter(playerChange => {
    const initialPlayerChange = initialPlayerChanges.value.find(
      pc => pc.profileId === playerChange.profileId,
    )

    return (
      initialPlayerChange?.inCourtProfileId !== playerChange.inCourtProfileId
    )
  })

const addOrReplaceRotationPlayer = (player: CallPlayerData) => {
  if (!selectedPosition.value) return
  if (!!props.rotation?.players) return

  if (!!props.isInitialRotationAssignment && !!player.libero) {
    toast.warn(t('rotations.libero_not_allowed_in_initial_rotation'))
    return
  }

  const existingPlayer = rotationPlayers.value.find(
    rp => rp.position === selectedPosition.value,
  )

  if (existingPlayer) {
    if (
      selectedRotationInCourtCaptain.value?.profileId ===
      existingPlayer.profileId
    ) {
      selectedRotationInCourtCaptain.value = undefined
    }

    rotationPlayers.value = rotationPlayers.value.filter(
      rp => rp.position !== selectedPosition.value,
    )
  }

  rotationPlayers.value.push({
    id: 0,
    profileId: player.profileId,
    rotationId: 0,
    replacementProfileId: undefined,
    inCourtProfileId: player.profileId,
    position: selectedPosition.value,
    status: ROTATION_PLAYER_STATUS.approved,
    currentPosition: selectedPosition.value,
    libero: false,
    changeWindows: [],
  })

  if (player.captain) {
    setRotationCaptain(player.profileId)
  }

  selectedPosition.value = null
}

const changePlayer = (replacementPlayer: CallPlayerData) => {
  if (!playerToReplace.value) return

  const playerChangesHasLibero = !!playerChanges.value.find(pc => pc.libero)

  if (playerChangesHasLibero && replacementPlayer.libero) {
    toast.error(t('rotations.only_one_libero_in_court_allowed'))
    return
  }

  const isReplacementPlayerLiberoInAttackPosition =
    replacementPlayer.libero &&
    selectedPosition.value &&
    ATTACK_POSITIONS.includes(selectedPosition.value)

  if (isReplacementPlayerLiberoInAttackPosition) {
    toast.error(t('rotations.libero_not_allowed_in_attack_positions'))
    return
  }

  const rotationPlayerToReplace = rotationPlayers.value.find(
    rp => rp.profileId === playerToReplace.value?.profileId,
  )

  if (!rotationPlayerToReplace) return

  checkIfInCourtCaptainIsRemoved(rotationPlayerToReplace.profileId)

  if (rotationPlayerToReplace.profileId === selectedCaptain.value?.profileId) {
    selectedRotationInCourtCaptain.value = undefined
  }

  if (
    rotationPlayerToReplace.replacementProfileId &&
    rotationPlayerToReplace.replacementProfileId === replacementPlayer.profileId
  ) {
    toast.error(
      t('rotations.replacement_taken', {
        name: getFullName(playerToReplace.value),
      }),
    )
    return
  }

  playerChanges.value.push({
    id: rotationPlayerToReplace.id,
    profileId: rotationPlayerToReplace.profileId,
    replacementProfileId:
      rotationPlayerToReplace.replacementProfileId ??
      replacementPlayer.profileId,
    inCourtProfileId:
      rotationPlayerToReplace.inCourtProfileId ===
      rotationPlayerToReplace.profileId
        ? replacementPlayer.profileId
        : rotationPlayerToReplace.profileId,
    position: selectedPosition.value ?? 0,
    status: ROTATION_PLAYER_STATUS.pending,
    libero: replacementPlayer.libero,
    comesFromApi: false,
    changeWindows: rotationPlayerToReplace.changeWindows,
  })

  emit('change:players', removeUnchangedPlayerChanges(playerChanges.value))

  const callPlayerSelectedCaptain = props.call.playersData.find(
    player =>
      player.profileId ===
      selectedRotationInCourtCaptain.value?.inCourtProfileId,
  )

  if (!callPlayerSelectedCaptain?.captain && replacementPlayer.captain) {
    setRotationCaptain(replacementPlayer.profileId)
  }

  selectedPosition.value = null
}

const handlePlayerChangeUndo = (playerChange: RotationPlayerChangeRequest) => {
  return !playerChange.comesFromApi
    ? removePlayerChange(playerChange)
    : mapPlayerChangeToChangeType(playerChange) === ChangeType.FIRST
    ? undoPlayerChange(playerChange)
    : undoSecondPlayerChange(playerChange)
}

const undoPlayerChange = (playerChange: RotationPlayerChangeRequest) => {
  checkIfInCourtCaptainIsRemoved(playerChange.inCourtProfileId)

  console.log('undoPlayerChange', props.rotation?.inCourtCaptainProfileId)

  playerChanges.value.map(pc => {
    if (pc.profileId === playerChange.profileId) {
      pc.inCourtProfileId = pc.profileId
      pc.libero = false
    }
  })

  hideUndoPlayerChangeDialog()

  emit('change:players', removeUnchangedPlayerChanges(playerChanges.value))

  const playerIn = props.call.playersData.find(
    player => player.profileId === playerChange.inCourtProfileId,
  )

  if (playerIn?.captain) {
    emit('update:captain', playerIn.profileId)
  }
}

const undoSecondPlayerChange = (playerChange: RotationPlayerChangeRequest) => {
  playerChanges.value.map(pc => {
    if (pc.profileId === playerChange.profileId) {
      pc.inCourtProfileId = pc.replacementProfileId
    }
  })

  hideUndoPlayerChangeDialog()

  emit('change:players', removeUnchangedPlayerChanges(playerChanges.value))
}

const removePlayerChange = (playerChange: RotationPlayerChangeRequest) => {
  playerChanges.value = playerChanges.value.filter(
    pc => pc.profileId !== playerChange.profileId,
  )

  checkIfInCourtCaptainIsRemoved(playerChange.inCourtProfileId)

  hideUndoPlayerChangeDialog()

  emit('change:players', removeUnchangedPlayerChanges(playerChanges.value))
}

const checkIfInCourtCaptainIsRemoved = (profileId: number) => {
  console.log('checkIfInCourtCaptainIsRemoved', {
    profileId,
    icProfileId: props.rotation?.inCourtCaptainProfileId,
  })
  if (profileId === props.rotation?.inCourtCaptainProfileId) {
    console.log('entra en check')
    selectedRotationInCourtCaptain.value = undefined
    emit('update:captain', 0)

    setTimeout(() => {
      if (!selectedCaptain.value) {
        toggleCaptainSelector()
      }
    }, 100)
  }
}

const getPlayerChangeByPosition = (position: number) =>
  playerChanges.value.find(pc => pc.position === position)

const getCallPlayerDataByPosition = (
  position: number,
): CallPlayerData | undefined =>
  props.call.playersData.find(
    p =>
      p.profileId ===
      rotationPlayers.value.find(rp => rp.currentPosition === position)
        ?.profileId,
  )

const getRotationInCourtPlayerByPosition = (
  position: number,
): CallPlayerData | undefined =>
  props.call.playersData.find(
    p =>
      p.profileId ===
      rotationPlayers.value.find(rp => rp.currentPosition === position)
        ?.inCourtProfileId,
  )

const isPlayerInCurrentChanges = (player?: CallPlayerData): boolean => {
  return !!playerChanges.value.find(
    pc =>
      pc.profileId === player?.profileId &&
      pc.inCourtProfileId !== pc.profileId,
  )
}

const toggleCaptainSelector = () => {
  if (!selectedCaptain.value) {
    showCaptainSelector.value = true
  } else {
    if (
      !canChangeCaptain.value /*  ||
      !selectableCaptainPlayers.value.length ||
      (props.rotation?.locked && props.isInitialRotationAssignment) ||
      props.rotation?.requestedInCourtCaptainProfileId ===
        selectedCaptain.value?.profileId ||
      props.initialRotation?.inCourtCaptainProfileId ===
        selectedCaptain.value?.profileId */
    ) {
      return
    }

    showCaptainSelector.value = true
  }
}

const handleRotationCourtPositionClick = (position: number) => {
  const playerData = getCallPlayerDataByPosition(position)

  if (totalPlayerChanges.value >= MAX_ROTATION_PLAYER_CHANGES) {
    toast.warn(
      t('rotations.max_changes_reached', {
        num: MAX_ROTATION_PLAYER_CHANGES,
      }),
    )
    return
  }

  const playerChange = getPlayerChangeByPosition(position)

  if (
    playerChange?.comesFromApi &&
    playerChange?.status === ROTATION_PLAYER_STATUS.pending
  ) {
    toast.warn(t('player_change_requests.waiting_for_approval'))
    return
  }

  const replacementPlayerSanctioned =
    !!playerChange?.comesFromApi &&
    !!playerChange?.replacementProfileId &&
    memberSanctions.value
      .filter(sanction => EXPULSION_SEVERITIES.includes(sanction.severity))
      .map(sanction => sanction.playerProfileId)
      .includes(playerChange?.profileId ?? 0)

  if (replacementPlayerSanctioned) {
    toast.error(t('rotations.replacement_player_sanctioned'))
    return
  }

  switch (mapPlayerChangeToChangeType(playerChange)) {
    case ChangeType.NONE:
    case ChangeType.FIRST:
      return selectPosition(position)
    case ChangeType.SECOND:
      return playerData && showMaxChangesReachedToast(playerData)
  }
}

const showMaxChangesReachedToast = (playerData: CallPlayerData) => {
  toast.warn(
    t('rotations.max_player_change_changes_reached', {
      name: getFullName(playerData),
    }),
  )
}

const getPlayerSanction = (player?: Player): Sanction | undefined => {
  if (!player) return undefined

  const scope =
    props.rotation && props.isInitialRotationAssignment ? 'set' : 'game'

  return getPlayerItemSanction(
    memberSanctions.value,
    props.rotation?.setId,
    props.call.teamId,
    player.profileId,
    SanctionMember.player as SanctionMemberKey,
    scope,
  )
}

const showDenyDialog = (deniedChange: RotationPlayerChangeRequest) => {
  showDenyReasonDialog.value = deniedChange
}

const hideDenyDialog = () => {
  showDenyReasonDialog.value = undefined
}

const listenGamePlayerRotationStatusUpdatedEvent = () => {
  listenedEvents.value.push(
    `game.${route.params.gameId}.rotation.${route.params.rotationId}.player-rotation-status-updated`,
  )
  window.Echo.channel(
    `game.${route.params.gameId}.rotation.${route.params.rotationId}.player-rotation-status-updated`,
  ).listen(
    ApiEvents.PLAYER_ROTATON_STATUS_UPDATED,
    (response: ApiGamePlayerRotationStatusUpdatedEventResponse) => {
      console.log('PLAYER_ROTATON_STATUS_UPDATED', response)
      playerChangeToUndo.value = undefined
      initialPlayerChangeToUndo.value = undefined

      const playerIn = props.call.playersData.find(
        player => player.profileId === response.player_in_profile_id,
      )

      const playerOut = props.call.playersData.find(
        player => player.profileId === response.player_out_profile_id,
      )

      playerChangeApprovedOrDenied.value =
        playerIn && playerOut ? { in: playerIn, out: playerOut } : undefined

      if (response.status === 'approved') {
        toast.success(
          t('player_change_requests.approved_json', {
            playerChange: JSON.stringify(playerChangeApprovedOrDenied.value),
          }),
          {
            group: 'player-changes',
            life: 10000,
          },
        )
      } else {
        toast.error(
          t('player_change_requests.denied_json', {
            playerChange: JSON.stringify(playerChangeApprovedOrDenied.value),
          }),
          {
            group: 'player-changes',
            life: 10000,
          },
        )
      }

      emit(
        'playerRotationStatusUpdated',
        mapApiRotationToRotation(response.rotation),
      )
    },
  )
}

const listenAllChannels = () => {
  if (
    !listenedEvents.value.includes(
      `game.${route.params.gameId}.rotation.${route.params.rotationId}.player-rotation-status-updated`,
    )
  ) {
    listenGamePlayerRotationStatusUpdatedEvent()
  }
}

// const leaveAllChannels = () => {
//   window.Echo.leaveAllChannels()
//   listenedEvents.value = []
// }

watch(selectedCaptain, newVal => {
  setRotationCaptain(newVal?.profileId ?? 0)
})

watch(rotationPlayers, newVal => emit('update:players', newVal), {
  deep: true,
})

watch(
  () => props.rotation,
  () => {
    if (props.rotation?.players) {
      rotationPlayers.value = props.rotation.players
    }
    setRotationCaptain(
      props.rotation?.requestedInCourtCaptainProfileId ??
        props.rotation?.inCourtCaptainProfileId ??
        0,
    )

    const rotationPlayerCaptain = rotationPlayers.value.find(
      rp => rp.inCourtProfileId === callCaptain.value?.profileId,
    )

    if (rotationPlayerCaptain) {
      setRotationCaptain(rotationPlayerCaptain.inCourtProfileId)
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => props.initialRotation,
  () => setRotationPlayersFromRtotation(),
  {
    deep: true,
    immediate: true,
  },
)

onMounted(() => {
  listenAllChannels()
})

onUpdated(() => {
  listenAllChannels()
})
</script>

<template>
  <EasyGrid
    class="easy-coach-rotation-court-changes-wrapper mt-10 relative"
    :breakpoints="breakpoints"
    :gap="6"
  >
    <CoachRotationPlayerChangeToast
      :playerChangeApprovedOrDenied="playerChangeApprovedOrDenied"
      @close="playerChangeApprovedOrDenied = undefined"
    />

    <RotationPlayerSanctionedMessage
      v-if="initialRotationPlayersToBeReplacedForSanction.length"
      :playersData="initialRotationPlayersToBeReplacedForSanction"
    />

    <div
      :class="[
        'easy-game-court-component easy-coach-rotation-court-component',
        {
          'is-disabled':
            !!props.isInitialRotationAssignment &&
            props.rotation?.players.length === 6,
        },
      ]"
    >
      <div class="wrapper">
        <div class="court">
          <div class="side left">
            <CoachRotationCourtPosition
              v-for="position in POSITIONS"
              :key="position"
              :position="position"
              :player="getCallPlayerDataByPosition(position)"
              :inCourtPlayer="getRotationInCourtPlayerByPosition(position)"
              :captainProfileId="
                isInitialRotationAssignment
                  ? selectedCaptain?.profileId ?? 0
                  : rotation?.inCourtCaptainProfileId ?? 0
              "
              :isBeingReplaced="
                isPlayerInCurrentChanges(getCallPlayerDataByPosition(position))
              "
              :isRequestPending="
                getPlayerChangeByPosition(position)?.status === 'pending'
              "
              :showPendingStatus="
                !!getPlayerChangeByPosition(position)?.comesFromApi &&
                getPlayerChangeByPosition(position)?.status === 'pending'
              "
              :changesCount="
                mapPlayerChangeToChangeType(getPlayerChangeByPosition(position))
              "
              :initialPlayerSanction="
                getPlayerSanction(getCallPlayerDataByPosition(position))
              "
              :replacementPlayerSanction="
                getPlayerSanction(getRotationInCourtPlayerByPosition(position))
              "
              @click="handleRotationCourtPositionClick(position)"
            />
          </div>
          <div class="side right">
            <div
              v-for="position in POSITIONS"
              :key="position"
              :class="[`position-${position}`]"
            ></div>
          </div>
        </div>
      </div>

      <div
        :class="[
          'easy-captain-selector mt-5',
          {
            'lg:max-w-[var(--court-max-width)] lg:mx-auto':
              !props.isInitialRotationAssignment,
          },
        ]"
      >
        <div
          class="inline-flex items-start justify-center"
          :class="{ 'pointer-events-none': !canChangeCaptain }"
          @click="toggleCaptainSelector"
        >
          <EasyGrid :gap="5">
            <GameCallSelectedCaptain
              class="cursor-pointer"
              :class="{
                'grayscale pointer-events-none':
                  rotation?.locked && props.isInitialRotationAssignment,
              }"
              :player="selectedCaptain"
              :inCourtCaptain="!props.isInitialRotationAssignment"
            />
            <GameCallSelectedLibero
              v-for="libero in liberoPlayers"
              :player="libero"
            />
          </EasyGrid>
          <Button
            v-if="canChangeCaptain"
            class="change-captain-button ml-3 mt-0.5"
            :style="{ fontSize: '0.8rem', padding: '0.3rem 0.5rem 0.325rem ' }"
            :label="selectedCaptain ? t('forms.change') : t('forms.select')"
            size="small"
          />
        </div>
      </div>
    </div>

    <div>
      <CoachRotationPlayerChanges
        v-if="!props.isInitialRotationAssignment"
        :class="[
          {
            'is-disabled':
              !!props.isInitialRotationAssignment &&
              props.rotation?.players.length === 6,
          },
        ]"
        :playersData="props.call.playersData"
        :playerChanges="playerChanges"
        :initialPlayerChanges="initialPlayerChanges"
        :call="props.call"
        :rotation="props.rotation"
        :sanctions="memberSanctions"
        @remove:playerChange="setPlayerChangeToUndo"
        @undo:playerChange="setPlayerChangeToUndo"
      />

      <div
        v-if="
          !props.isInitialRotationAssignment && !!deniedPlayerChanges?.length
        "
        :class="{
          'mt-8': !!playerChanges.length,
          'is-disabled':
            !!props.isInitialRotationAssignment &&
            props.rotation?.players.length === 6,
        }"
      >
        <GameStatus
          class="mb-3"
          status="denied"
          :statusLabel="
            t(
              'player_change_requests.request_denied',
              deniedPlayerChanges?.length,
            )
          "
        />
        <CoachRotationPlayerChanges
          :playersData="props.call.playersData"
          :playerChanges="
            deniedPlayerChanges
              .flatMap(dc => dc.playerChange)
              .filter(dc => !!dc)
              .sort((a, b) => a.position - b.position)
          "
          :initialPlayerChanges="initialPlayerChanges"
          :call="props.call"
          :rotation="props.rotation"
          :sanctions="memberSanctions"
          @info:playerChange="showDenyDialog"
        />
      </div>
    </div>

    <Button
      v-if="isInitialRotationAssignment && !rotationPlayers.length"
      :class="[
        {
          'is-disabled':
            !!props.isInitialRotationAssignment &&
            props.rotation?.players.length === 6,
        },
      ]"
      label="AUTO ROTACIÓN"
      @click="handleAutoRotation"
    />
  </EasyGrid>

  <DialogBottom
    class="easy-coach-rotation-players-dialog-component"
    :visible="!!selectedPosition"
    :hasStickyFooter="false"
    @hide="selectedPosition = null"
  >
    <template #header>
      <Heading tag="h6">{{
        playerToReplace
          ? t('players.replace_player', { name: getFullName(playerToReplace) })
          : t('players.select')
      }}</Heading>
    </template>

    <template v-if="availableBenchPlayers.length">
      <CoachRotationPlayer
        v-for="player in availableBenchPlayers"
        :key="player.profileId"
        :player="player"
        :sanction="getPlayerSanction(mapCallPlayerDataToPlayer(player))"
        @click="
          !!props.isInitialRotationAssignment
            ? addOrReplaceRotationPlayer(player)
            : changePlayer(player)
        "
      />
    </template>

    <Message v-else :closable="false">{{ t('players.no_available') }}</Message>

    <template v-if="expelledPlayers.length">
      <Heading class="mt-5" tag="h6">
        {{ t('sanctions.expelled_player', 2) }}
      </Heading>
      <CoachRotationPlayer
        v-for="player in expelledPlayers"
        :key="player.profileId"
        class="pointer-events-none"
        :player="player"
        :sanction="getPlayerSanction(mapCallPlayerDataToPlayer(player))"
      />
    </template>
  </DialogBottom>

  <DialogBottom
    class="easy-coach-rotation-captain-selector-dialog-component"
    :visible="showCaptainSelector"
    :hasStickyFooter="false"
    @hide="showCaptainSelector = false"
  >
    <template #header>
      <Heading tag="h6">{{ t('teams.in_court_captain_select') }}</Heading>
    </template>

    <CoachRotationPlayer
      v-for="player in selectableCaptainPlayers"
      :player="player"
      @click="setRotationCaptain(player.profileId)"
    />
  </DialogBottom>

  <DialogBottom
    class="easy-coach-rotation-undo-player-change-dialog-component"
    :visible="showUndoPlayerChange"
    @hide="hideUndoPlayerChangeDialog"
  >
    <template #header>
      <Heading tag="h6">{{
        initialPlayerChangeToUndo &&
        playerChangeToUndo?.inCourtProfileId ===
          initialPlayerChangeToUndo.inCourtProfileId
          ? t('rotations.do_player_change')
          : t('rotations.cancel_player_change')
      }}</Heading>
    </template>

    <CoachRotationPlayerChangeItem
      v-if="playerChangeToUndo"
      class="my-5"
      :playersData="props.call.playersData"
      :playerChange="playerChangeToUndo"
      :initialPlayerChange="initialPlayerChangeToUndo ?? playerChangeToUndo"
      :initialPlayerSanction="
        getPlayerSanction(
          getPlayerDataByProfileId(
            props.call.playersData,
            initialPlayerChangeToUndo
              ? playerChangeToUndo.replacementProfileId
              : playerChangeToUndo.profileId,
          ),
        )
      "
      :replacementPlayerSanction="
        getPlayerSanction(
          getPlayerDataByProfileId(
            props.call.playersData,
            initialPlayerChangeToUndo
              ? playerChangeToUndo.profileId
              : playerChangeToUndo.replacementProfileId,
          ),
        )
      "
      :type="initialPlayerChangeToUndo ? ChangeType.SECOND : ChangeType.FIRST"
      :changesCount="
        mapPlayerChangeToChangeType(
          initialPlayerChangeToUndo ?? playerChangeToUndo,
        )
      "
      block
    />

    <template #stickyFooter>
      <FormFooterActions
        :submitLabel="submitLabel"
        @form:submit="
          playerChangeToUndo && handlePlayerChangeUndo(playerChangeToUndo)
        "
        @form:cancel="hideUndoPlayerChangeDialog"
      />
    </template>
  </DialogBottom>

  <RotationPlayerChangeDenyReasonDialog
    :visible="!!showDenyReasonDialog"
    :reason="showDenyReasonDialog?.denyReason"
    readonly
    @hide="hideDenyDialog"
  />
</template>

<script lang="ts">
export default {
  name: 'CoachRotationCourt',
}
</script>
