<script setup lang="ts">
import { Call, CallPlayerData, getPlayerDataByProfileId } from '@/domain/call'
import { Set } from '@/domain/set'
import {
  ATTACK_POSITIONS,
  ChangeType,
  MAX_ROTATION_PLAYER_CHANGES,
  RotationPlayer,
  RotationPlayerChangeRequest,
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
}>()

const { t } = useI18n()
const toast = useEasyToast()

const rotationPlayers = ref<RotationPlayer[]>([])
const selectedPosition = ref<number | null>(null)
const selectedRotationInCourtCaptain = ref<RotationPlayer>()
const showCaptainSelector = ref(false)
const showUndoPlayerChange = ref(false)
const playerChangeToUndo = ref<RotationPlayerChangeRequest>()
const initialPlayerChangeToUndo = ref<RotationPlayerChangeRequest>()

const playerChanges = ref<RotationPlayerChangeRequest[]>([])
const initialPlayerChanges = ref<RotationPlayerChangeRequest[]>([])

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
    !selectedCaptain.value?.captain &&
    selectableCaptainPlayers.value.every(player => !player.captain),
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
  !!playerChanges.value.length ? { lg: 2 } : undefined,
)

const setRotationPlayersFromRtotation = () => {
  playerChanges.value = []

  if (!props.initialRotation?.players) return

  for (const i in props.initialRotation.players) {
    const player = props.initialRotation.players[i]
    if (!player.replacementProfileId) continue

    playerChanges.value.push({
      profileId: player.profileId,
      replacementProfileId: player.replacementProfileId,
      inCourtProfileId: player.inCourtProfileId,
      position: player.currentPosition,
      libero: player.libero,
      changeWindows: player.changeWindows,
      comesFromApi: true,
    })

    initialPlayerChanges.value = JSON.parse(JSON.stringify(playerChanges.value))
  }
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
    profileId: player.profileId,
    rotationId: 0,
    replacementProfileId: undefined,
    inCourtProfileId: player.profileId,
    position: selectedPosition.value,
    currentPosition: selectedPosition.value,
    libero: false,
    changeWindows: [],
  })

  if (!selectedRotationInCourtCaptain.value) {
    selectedRotationInCourtCaptain.value = rotationPlayers.value.find(
      rp => player.captain && rp.profileId === player.profileId,
    )
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
  playerChanges.value.map(pc => {
    if (pc.profileId === playerChange.profileId) {
      pc.inCourtProfileId = pc.profileId
      pc.libero = false
    }
  })

  checkIfInCourtCaptainIsRemoved(playerChange.inCourtProfileId)

  hideUndoPlayerChangeDialog()

  emit('change:players', removeUnchangedPlayerChanges(playerChanges.value))
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
  if (profileId === props.rotation?.inCourtCaptainProfileId) {
    selectedRotationInCourtCaptain.value = undefined
    emit('update:captain', 0)
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
  if (
    !canChangeCaptain ||
    !selectableCaptainPlayers.value.length ||
    (props.rotation?.locked && props.isInitialRotationAssignment)
  )
    return
  showCaptainSelector.value = true
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
    setRotationCaptain(props.rotation?.inCourtCaptainProfileId ?? 0)
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
</script>

<template>
  <EasyGrid
    class="easy-coach-rotation-court-changes-wrapper mt-10 relative"
    :breakpoints="breakpoints"
    :gap="6"
  >
    <RotationPlayerSanctionedMessage
      v-if="initialRotationPlayersToBeReplacedForSanction.length"
      :playersData="initialRotationPlayersToBeReplacedForSanction"
    />

    <div class="easy-game-court-component easy-coach-rotation-court-component">
      <div class="wrapper">
        <div
          class="court"
          :class="{
            'is-disabled':
              !!props.isInitialRotationAssignment && !!props.rotation?.players,
          }"
        >
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
              :itsBeingReplaced="
                isPlayerInCurrentChanges(getCallPlayerDataByPosition(position))
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
    </div>

    <div>
      <div
        class="easy-captain-selector inline-flex items-center justify-center"
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
          v-if="
            canChangeCaptain &&
            selectedRotationInCourtCaptain &&
            !!selectableCaptainPlayers.length &&
            !rotation?.locked
          "
          class="change-captain-button ml-3"
          :label="t('forms.change')"
          size="small"
        />
      </div>

      <CoachRotationPlayerChanges
        v-if="!props.isInitialRotationAssignment"
        :playersData="props.call.playersData"
        :playerChanges="playerChanges"
        :initialPlayerChanges="initialPlayerChanges"
        :call="props.call"
        :rotation="props.rotation"
        :sanctions="memberSanctions"
        @remove:playerChange="setPlayerChangeToUndo"
        @undo:playerChange="setPlayerChangeToUndo"
      />
    </div>
  </EasyGrid>

  <DialogBottom
    class="easy-coach-rotation-players-dialog-component"
    :visible="!!selectedPosition"
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

    <template #footer>
      <FormFooterActions
        :submitLabel="submitLabel"
        @form:submit="
          playerChangeToUndo && handlePlayerChangeUndo(playerChangeToUndo)
        "
        @form:cancel="hideUndoPlayerChangeDialog"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'CoachRotationCourt',
}
</script>
