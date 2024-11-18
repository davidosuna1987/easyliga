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
  getRotationPlayerInjury,
  isPlayerInjured,
  mapApiRotationToRotation,
  mapDeniedPlayerChangeToPlayerInOut,
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
import {
  getInjuryReplacementProfileIdByProfileId,
  getInvalidInjuryFormRequestInjuriesTranslationKey,
  getInvalidInjuryFormRequestTranslationKey,
  Injury,
  INJURY_DESCRIPTION_MIN_LENGTH,
  InjuryFormRequest,
  isValidInjuryFormRequest,
  isValidInjuryFormRequestInjury,
  mapInjuryToPlayerInOut,
} from '@/domain/injury'
import { equalObjects } from '@/domain/utils'

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
  (e: 'injury:changed', value: InjuryFormRequest): void
}>()

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()

const listenedEvents = ref<string[]>([])
const rotationPlayers = ref<RotationPlayer[]>([])
const selectedPosition = ref<number>()
const selectedRotationInCourtCaptain = ref<RotationPlayer>()
const showCaptainSelector = ref(false)
const showUndoPlayerChange = ref(false)
const playerChangeToUndo = ref<RotationPlayerChangeRequest>()
const initialPlayerChangeToUndo = ref<RotationPlayerChangeRequest>()
const playerChangeToUndoPosition = ref<number>()
const playerChangeApprovedOrDenied = ref<PlayerChangeInOut>()
const showDenyReasonDialog = ref<RotationPlayerChangeRequest>()

const playerChanges = ref<RotationPlayerChangeRequest[]>([])
const initialPlayerChanges = ref<RotationPlayerChangeRequest[]>([])

const showPlayerChangeInjuryForm = ref<Boolean>(false)
const injuryFormRequest = ref<InjuryFormRequest>({
  gameId: 0,
  setId: 0,
  rotationId: 0,
  teamId: 0,
  injuries: [],
})
const injuryFormRequestInjury = ref<InjuryFormRequest['injuries'][number]>({
  playerRotationId: 0,
  profileId: 0,
  replacementProfileId: 0,
  libero: false,
  description: '',
  playerInShirtNumber: undefined,
  playerOutShirtNumber: undefined,
})

const playerChangeInjured = ref<boolean>(false)
const playerChangeInjuryDescription = ref<string>()

const rotationPlayersMergePlayerChanges = computed(() =>
  rotationPlayers.value.map(rotationPlayer => {
    const playerChange = playerChanges.value.find(
      pc => pc.profileId === rotationPlayer.profileId,
    )

    return playerChange
      ? {
          ...rotationPlayer,
          ...playerChange,
        }
      : rotationPlayer
  }),
)

const injuredPlayerChangeToUndo = computed((): CallPlayerData | undefined => {
  const { playerOut } = getPlayerInOutByPosition(
    playerChangeToUndoPosition.value ?? 0,
  )

  const injury = props.rotation?.injuries?.find(
    i => i.profileId === playerOut?.profileId,
  )

  return injury
    ? getPlayerDataByProfileId(props.call.playersData, injury?.profileId)
    : playerChangeToUndo.value?.injuredProfileId
    ? getPlayerDataByProfileId(
        props.call.playersData,
        playerChangeToUndo.value.injuredProfileId,
      )
    : undefined
})

const injuryPlayerIn = computed(() =>
  getPlayerDataByProfileId(
    props.call.playersData,
    injuryFormRequestInjury.value.replacementProfileId,
  ),
)

const injuryPlayerOut = computed(() =>
  getPlayerDataByProfileId(
    props.call.playersData,
    injuryFormRequestInjury.value.profileId,
  ),
)

const callCaptain = computed(() =>
  props.call.playersData.find(player => player.captain),
)

const totalPlayerChanges = computed(
  () =>
    requestedPlayerChanges.value.length +
    (props.rotation?.playerChangesCount ?? 0),
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

const expelledPlayers = computed((): CallPlayerData[] =>
  benchPlayers.value.filter(player =>
    expulsionSanctions.value
      ?.map(sanction => sanction.playerProfileId)
      .includes(player.profileId),
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

const injuredPlayers = computed((): CallPlayerData[] =>
  props.call.playersData.filter(player =>
    props.rotation?.injuries
      ?.map(injury => injury.profileId)
      .includes(player.profileId),
  ),
)

const availableBenchPlayers = computed((): CallPlayerData[] =>
  benchPlayers.value.filter(
    player =>
      !expulsionSanctions.value
        ?.map(sanction => sanction.playerProfileId)
        .includes(player.profileId) &&
      !injuredPlayers.value
        .map(player => player.profileId)
        .includes(player.profileId) &&
      !props.rotation?.injuries
        ?.map(injury => injury.replacementProfileId)
        .includes(player.profileId) &&
      !props.rotation?.players
        .map(player => player.injuredProfileId)
        .includes(player.profileId),
  ),
)

const availableInjuryPlayers = computed((): CallPlayerData[] =>
  props.call.playersData.filter(
    player =>
      !player.libero &&
      !isPlayerInjured(
        player.profileId,
        rotationPlayersMergePlayerChanges.value,
        props.rotation?.injuries,
      ) &&
      !rotationPlayers.value
        .map(rp => rp.inCourtProfileId)
        .includes(player.profileId) &&
      !playerChanges.value
        .filter(pc => pc.comesFromApi)
        .map(pc => pc.inCourtProfileId)
        .includes(player.profileId) &&
      !requestedPlayerChanges.value
        .map(pc => pc.replacementProfileId)
        .includes(player.profileId) &&
      !requestedPlayerChanges.value
        .filter(pc => pc.inCourtProfileId !== pc.profileId)
        .map(pc => pc.profileId)
        .includes(player.profileId) &&
      !expulsionSanctions.value
        ?.map(sanction => sanction.playerProfileId)
        .includes(player.profileId) &&
      !injuredPlayers.value
        .map(player => player.profileId)
        .includes(player.profileId) &&
      !props.rotation?.injuries
        ?.map(injury => injury.replacementProfileId)
        .includes(player.profileId) &&
      !props.rotation?.players
        .map(player => player.injuredProfileId)
        .includes(player.profileId),
  ),
)

const availableChangePlayers = computed((): CallPlayerData[] =>
  !!showPlayerChangeInjuryForm.value
    ? availableInjuryPlayers.value
    : availableBenchPlayers.value,
)

const requestedPlayerChanges = computed((): RotationPlayerChangeRequest[] =>
  playerChanges.value.filter(pc => !pc.comesFromApi),
)

const apiPlayerChanges = computed((): RotationPlayerChangeRequest[] =>
  playerChanges.value.filter(pc => pc.comesFromApi),
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
  getCallPlayerDataByProfileId(
    selectedRotationInCourtCaptain.value?.inCourtProfileId,
  ),
)

const liberoPlayers = computed(() =>
  props.call.playersData.filter(player => player.libero),
)

const rotationPlayerToReplace = computed(() =>
  rotationPlayers.value.find(
    rp => rp.currentPosition === selectedPosition.value,
  ),
)

const playerToReplace = computed(() => {
  let inCourtProfileId = rotationPlayerToReplace.value?.inCourtProfileId
  if (!inCourtProfileId) return

  do {
    const injuryReplacementProfileId = getInjuryReplacementProfileIdByProfileId(
      inCourtProfileId,
      props.rotation?.injuries ?? [],
    )

    if (injuryReplacementProfileId) {
      inCourtProfileId = injuryReplacementProfileId
    } else {
      break
    }
  } while (true)

  return getCallPlayerDataByProfileId(inCourtProfileId)
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

const submitLabelAction = computed((): string =>
  !!initialPlayerChangeToUndo.value &&
  playerChangeToUndo.value?.inCourtProfileId ===
    initialPlayerChangeToUndo.value.inCourtProfileId
    ? injuredPlayerChangeToUndo.value
      ? 'injury'
      : 'change'
    : 'cancel',
)

const submitLabel = computed((): string => {
  switch (submitLabelAction.value) {
    case 'injury':
      return t('rotations.player_change_injured')
    case 'change':
      return t('rotations.do_player_change')
    default:
      return t('rotations.cancel_player_change')
  }
})

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

const maxPlayerChangesReached = computed(
  (): boolean => totalPlayerChanges.value >= MAX_ROTATION_PLAYER_CHANGES,
)

const cannotReplacePlayersMessage = computed((): string => {
  const messages = []

  if (!availableChangePlayers.value.length) {
    messages.push(t('players.no_available'))
  }

  if (maxPlayerChangesReached.value) {
    messages.push(t('rotations.max_player_changes_reached'))
  }

  const parsedMessages = messages.map((message, index) =>
    index === 0 ? message : message.toLocaleLowerCase(),
  )

  return parsedMessages.joinReplaceLast(', ', ` ${t('forms.and')} `)
})

const showExtraordinaryChangesButton = computed(
  (): boolean =>
    !props.isInitialRotationAssignment &&
    !showPlayerChangeInjuryForm.value &&
    !availableBenchPlayers.value.length &&
    !!availableInjuryPlayers.value.length,
)

const showExtraordinaryUndoChangesButton = computed(
  (): boolean =>
    !!playerChangeToUndo.value?.comesFromApi &&
    !props.isInitialRotationAssignment &&
    !showPlayerChangeInjuryForm.value &&
    !availableBenchPlayers.value.length &&
    !!availableInjuryPlayers.value.length,
)

const showPlayerChangeInjuredToastMessage = computed((): string | undefined => {
  if (!!playerChangeInjured.value && !playerChangeInjuryDescription.value) {
    return t('errors.injuries.description')
  }

  if (
    !!playerChangeInjured.value &&
    !!playerChangeInjuryDescription.value &&
    playerChangeInjuryDescription.value.length < INJURY_DESCRIPTION_MIN_LENGTH
  ) {
    return t('errors.injuries.description_min_length', {
      min: INJURY_DESCRIPTION_MIN_LENGTH,
    })
  }

  return
})

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
      injured: player.injured,
      injuredProfileId: player.injuredProfileId,
      injuryDescription: player.injuryDescription,
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
      injured: false,
      injuredProfileId: undefined,
      injuryDescription: undefined,
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

const handleHideCoachRotationPlayersDialog = () => {
  selectedPosition.value = undefined
  showPlayerChangeInjuryForm.value = false
  playerChangeInjured.value = false
  playerChangeInjuryDescription.value = undefined
  resetInjuryFormRequestInjury()
}

const toggleShowPlayerChangeInjuryForm = () => {
  if (requestedPlayerChanges.value.length) {
    toast.error(t('rotations.submit_requested_changes_before_injury'))
    handleHideCoachRotationPlayersDialog()
    return
  }
  showPlayerChangeInjuryForm.value
    ? resetInjuryFormRequest()
    : prepareInjuryFormRequest()
  showPlayerChangeInjuryForm.value = !showPlayerChangeInjuryForm.value
}

const handleShowPlayerChangeInjuredForm = (injured: boolean) => {
  if (playerChangeInjured.value === injured) return

  playerChangeInjured.value = injured
  playerChangeInjuryDescription.value = undefined
}

const hideUndoPlayerChangeDialog = () => {
  showUndoPlayerChange.value = false
  playerChangeToUndo.value = undefined
  initialPlayerChangeToUndo.value = undefined
  playerChangeToUndoPosition.value = undefined
  handleHideCoachRotationPlayersDialog()
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
  playerChangeToUndoPosition.value = playerChange.position
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

const prepareInjuryFormRequest = () => {
  injuryFormRequest.value.gameId = props.call.gameId
  injuryFormRequest.value.setId = props.rotation?.setId ?? 0
  injuryFormRequest.value.rotationId = props.rotation?.id ?? 0
  injuryFormRequest.value.teamId = props.call.teamId
}

const resetInjuryFormRequest = () => {
  injuryFormRequest.value = {
    gameId: 0,
    setId: 0,
    rotationId: 0,
    teamId: 0,
    injuries: [],
  }
}

const resetInjuryFormRequestInjury = () => {
  injuryFormRequestInjury.value = {
    playerRotationId: 0,
    profileId: 0,
    replacementProfileId: 0,
    libero: false,
    description: '',
    playerInShirtNumber: undefined,
    playerOutShirtNumber: undefined,
  }
}

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
    injured: false,
    injuredProfileId: undefined,
    injuryDescription: undefined,
    changeWindows: [],
  })

  if (player.captain) {
    setRotationCaptain(player.profileId)
  }

  selectedPosition.value = undefined
}

const changePlayer = (replacementPlayer: CallPlayerData) => {
  if (!playerToReplace.value) return

  if (showPlayerChangeInjuredToastMessage.value) {
    toast.error(showPlayerChangeInjuredToastMessage.value)
    return
  }

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

  if (totalPlayerChanges.value >= MAX_ROTATION_PLAYER_CHANGES) {
    toast.error(t('rotations.max_player_changes_reached'))
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
    injured: playerChangeInjured.value,
    injuredProfileId: playerChangeInjured.value
      ? rotationPlayerToReplace.inCourtProfileId ===
        rotationPlayerToReplace.profileId
        ? rotationPlayerToReplace.profileId
        : replacementPlayer.profileId
      : undefined,
    injuryDescription: playerChangeInjuryDescription.value,
    comesFromApi: false,
    changeWindows: rotationPlayerToReplace.changeWindows,
  })

  emit('change:players', removeUnchangedPlayerChanges(playerChanges.value))

  const callPlayerSelectedCaptain = getCallPlayerDataByProfileId(
    selectedRotationInCourtCaptain.value?.inCourtProfileId,
  )

  if (!callPlayerSelectedCaptain?.captain && replacementPlayer.captain) {
    setRotationCaptain(replacementPlayer.profileId)
  }

  selectedPosition.value = undefined
  playerChangeInjured.value = false
  playerChangeInjuryDescription.value = undefined
}

const addInjury = (replacementPlayer: CallPlayerData) => {
  const { playerIn, playerOut } = getPlayerInOutByPosition(
    playerChangeToUndoPosition.value ?? 0,
  )
  console.log({
    playerIn,
    playerOut,
    playerInShirtNumber: replacementPlayer.shirtNumber,
  })
  injuryFormRequestInjury.value = {
    playerRotationId:
      rotationPlayerToReplace.value?.id ?? playerChangeToUndo.value?.id ?? 0,
    profileId:
      playerIn?.profileId ??
      playerToReplace.value?.profileId ??
      playerChangeToUndo.value?.inCourtProfileId ??
      0,
    replacementProfileId: replacementPlayer.profileId,
    libero: replacementPlayer.libero,
    description: '',
    playerInShirtNumber:
      // playerOut?.shirtNumber ??
      replacementPlayer.shirtNumber ??
      // getCallPlayerDataByProfileId(
      //   playerChangeToUndo.value?.replacementProfileId,
      // )?.shirtNumber ??
      undefined,
    playerOutShirtNumber:
      // playerIn?.shirtNumber ??
      // playerToReplace.value?.shirtNumber ??
      getCallPlayerDataByProfileId(playerChangeToUndo.value?.inCourtProfileId)
        ?.shirtNumber ?? undefined,
  }

  injuryFormRequest.value.injuries.push(injuryFormRequestInjury.value)

  // handleHideCoachRotationPlayersDialog()
}

const handleAddInjury = () => {
  if (
    !!showPlayerChangeInjuryForm.value &&
    (!isValidInjuryFormRequest(injuryFormRequest.value) ||
      !isValidInjuryFormRequestInjury(injuryFormRequestInjury.value))
  ) {
    const ifrTk = getInvalidInjuryFormRequestTranslationKey(
      injuryFormRequest.value,
    )
    const ifriTk = getInvalidInjuryFormRequestInjuriesTranslationKey([
      injuryFormRequestInjury.value,
    ])
    const ifrTranslationKey = ifrTk ?? ifriTk
    const translationKey = ifrTranslationKey ?? 'errors.whoops'
    toast.error(t(translationKey, { min: INJURY_DESCRIPTION_MIN_LENGTH }))
    return
  }

  playerChangeToUndo.value
    ? hideUndoPlayerChangeDialog()
    : handleHideCoachRotationPlayersDialog()

  emit('injury:changed', injuryFormRequest.value)
}

const handlePlayerChangeUndo = (playerChange: RotationPlayerChangeRequest) => {
  return !playerChange.comesFromApi
    ? removePlayerChange(playerChange)
    : mapPlayerChangeToChangeType(playerChange) === ChangeType.FIRST
    ? undoPlayerChange(playerChange)
    : undoSecondPlayerChange(playerChange)
}

const undoPlayerChange = (playerChange: RotationPlayerChangeRequest) => {
  if (showPlayerChangeInjuredToastMessage.value) {
    toast.error(showPlayerChangeInjuredToastMessage.value)
    return
  }

  if (totalPlayerChanges.value >= MAX_ROTATION_PLAYER_CHANGES) {
    toast.error(t('rotations.max_player_changes_reached'))
    return
  }

  checkIfInCourtCaptainIsRemoved(playerChange.inCourtProfileId)

  playerChanges.value.map(pc => {
    // if (pc.profileId === playerChange.profileId) {
    //   pc.inCourtProfileId = pc.profileId
    //   pc.libero = false
    // }
    if (playerChange.profileId === playerChange.profileId) {
      playerChange.libero = false
      playerChange.injured = playerChangeInjured.value
      playerChange.injuredProfileId = playerChangeInjured.value
        ? playerChange.inCourtProfileId === playerChange.profileId
          ? playerChange.profileId
          : playerChange.replacementProfileId
        : undefined
      playerChange.injuryDescription = playerChangeInjuryDescription.value
      playerChange.comesFromApi = false
      playerChange.inCourtProfileId = playerChange.profileId
    }
  })

  hideUndoPlayerChangeDialog()

  emit('change:players', removeUnchangedPlayerChanges(playerChanges.value))

  const playerIn = getCallPlayerDataByProfileId(playerChange.inCourtProfileId)

  if (playerIn?.captain) {
    emit('update:captain', playerIn.profileId)
  }
}

const undoSecondPlayerChange = (playerChange: RotationPlayerChangeRequest) => {
  console.log('undoSecondPlayerChange')
  playerChanges.value.map(pc => {
    if (pc.profileId === playerChange.profileId) {
      pc.inCourtProfileId = pc.replacementProfileId
    }
  })

  hideUndoPlayerChangeDialog()

  emit('change:players', removeUnchangedPlayerChanges(playerChanges.value))
}

const removePlayerChange = (playerChange: RotationPlayerChangeRequest) => {
  console.log('removePlayerChange')
  if (equalObjects(playerChangeToUndo.value, initialPlayerChangeToUndo.value)) {
    playerChanges.value = playerChanges.value.filter(
      pc => pc.profileId !== playerChange.profileId,
    )
  } else {
    playerChanges.value.map(pc => {
      if (initialPlayerChangeToUndo.value) {
        if (pc.profileId === playerChange.profileId) {
          pc.inCourtProfileId =
            initialPlayerChangeToUndo.value?.inCourtProfileId
          pc.replacementProfileId =
            initialPlayerChangeToUndo.value?.replacementProfileId
          pc.libero = initialPlayerChangeToUndo.value?.libero
          pc.injured = initialPlayerChangeToUndo.value?.injured
          pc.injuredProfileId =
            initialPlayerChangeToUndo.value?.injuredProfileId
          pc.injuryDescription =
            initialPlayerChangeToUndo.value?.injuryDescription
          pc.comesFromApi = initialPlayerChangeToUndo.value?.comesFromApi
        }
      } else {
        playerChanges.value = playerChanges.value.filter(
          pc => pc.id !== playerChange.id,
        )
      }
    })
  }

  checkIfInCourtCaptainIsRemoved(playerChange.inCourtProfileId)

  hideUndoPlayerChangeDialog()

  emit('change:players', removeUnchangedPlayerChanges(playerChanges.value))
}

const checkIfInCourtCaptainIsRemoved = (profileId: number) => {
  if (profileId === props.rotation?.inCourtCaptainProfileId) {
    selectedRotationInCourtCaptain.value = undefined
    emit('update:captain', 0)

    setTimeout(() => {
      if (!selectedCaptain.value) {
        toggleCaptainSelector()
      }
    }, 100)
  }
}

const isReplacementPlayerInInjuriesPlayerIn = (profileId?: number): boolean => {
  const replacementPlayer = props.call.playersData.find(
    player => player.profileId === profileId,
  )

  if (!replacementPlayer) return false

  const isReplacingInjuries = props.rotation?.injuries?.some(
    i => i.replacementProfileId === replacementPlayer.profileId,
  )

  const isInjuredInInjuries = props.rotation?.injuries?.some(
    i => i.profileId === replacementPlayer.profileId,
  )

  return !!isReplacingInjuries && !isInjuredInInjuries
}

const getPlayerChangeByPosition = (position: number) =>
  playerChanges.value.find(pc => pc.position === position)

const getRotationPlayerByPosition = (position: number) =>
  rotationPlayers.value.find(rp => rp.currentPosition === position)

const getCallPlayerDataByProfileId = (profileId?: number) =>
  profileId
    ? props.call.playersData.find(p => p.profileId === profileId)
    : undefined

const getPlayerInOutByPosition = (position: number) => {
  const rotationPlayer = getRotationPlayerByPosition(position)

  let injured =
    rotationPlayer?.injuredProfileId ===
    (rotationPlayer?.inCourtProfileId === rotationPlayer?.replacementProfileId
      ? rotationPlayer?.profileId
      : rotationPlayer?.replacementProfileId)
  let playerInProfileId = rotationPlayer?.inCourtProfileId
  let playerOutProfileId =
    rotationPlayer?.inCourtProfileId === rotationPlayer?.replacementProfileId
      ? rotationPlayer?.profileId
      : rotationPlayer?.replacementProfileId

  for (const injury of props.rotation?.injuries ?? []) {
    if (injury.profileId === playerInProfileId) {
      playerInProfileId = injury.replacementProfileId
      playerOutProfileId = injury.profileId
      injured = true
    }
  }

  return {
    playerIn: getCallPlayerDataByProfileId(playerInProfileId),
    playerOut: getCallPlayerDataByProfileId(playerOutProfileId),
    injured,
  }
}

const getCallPlayerDataByPosition = (
  position: number,
): CallPlayerData | undefined => {
  const rotationPlayer = getRotationPlayerByPosition(position)

  let profileId =
    rotationPlayer?.injuredProfileId === rotationPlayer?.profileId
      ? rotationPlayer?.replacementProfileId
      : rotationPlayer?.profileId

  let injuryProfileIdToSearch = profileId
  for (const injury of props.rotation?.injuries ?? []) {
    if (injury.profileId === injuryProfileIdToSearch) {
      injuryProfileIdToSearch = injury.replacementProfileId
      profileId = injury.profileId
    }
  }

  return getCallPlayerDataByProfileId(profileId)
}

const getRotationInCourtPlayerByPosition = (
  position: number,
): CallPlayerData | undefined => {
  const rotationPlayer = getRotationPlayerByPosition(position)

  let profileId = rotationPlayer?.inCourtProfileId
  if (!profileId) return

  for (const injury of props.rotation?.injuries ?? []) {
    if (injury.profileId === profileId) {
      profileId = injury.replacementProfileId
    }
  }

  return getCallPlayerDataByProfileId(profileId)
}

const getRotationPlayerInjuryByPosition = (
  position: number,
): Injury | undefined => {
  const rotationPlayer = getRotationPlayerByPosition(position)
  return getRotationPlayerInjury(rotationPlayer, props.rotation?.injuries)
}

const hasRotationPlayerInjuryByPosition = (position: number): boolean => {
  const { playerOut, injured } = getPlayerInOutByPosition(position)
  return (
    getRotationPlayerInjuryByPosition(position)?.profileId ===
      playerOut?.profileId || injured
  )
}

const isRotationPlayerInjuredByPosition = (position: number): boolean => {
  const rotationPlayer = getRotationPlayerByPosition(position)
  return (
    !!rotationPlayer?.injured ||
    !!playerChanges.value.find(pc => pc.profileId === rotationPlayer?.profileId)
      ?.injured
  )
}

const isPlayerInCurrentChanges = (player?: CallPlayerData): boolean => {
  return (
    !!playerChanges.value.find(
      pc =>
        pc.profileId === player?.profileId &&
        pc.inCourtProfileId !== pc.profileId,
    ) ||
    !!props.rotation?.injuries?.find(i => i.profileId === player?.profileId)
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
      return selectPosition(position)
  }
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

const initialPlayerChangeToUndoInjured = (): boolean =>
  !!playerChangeToUndo.value?.injured &&
  !!playerChangeToUndo.value?.inCourtProfileId ===
    !!playerChangeToUndo.value?.replacementProfileId

const replacementPlayerChangeToUndoInjured = (): boolean =>
  !!playerChangeToUndo.value?.injured &&
  !!playerChangeToUndo.value?.inCourtProfileId ===
    !!playerChangeToUndo.value?.profileId

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
      playerChangeToUndo.value = undefined
      initialPlayerChangeToUndo.value = undefined
      playerChangeToUndoPosition.value = undefined

      const playerIn = getCallPlayerDataByProfileId(
        response.player_in_profile_id,
      )

      const playerOut = getCallPlayerDataByProfileId(
        response.player_out_profile_id,
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
              :playerIn="getPlayerInOutByPosition(position).playerIn"
              :playerOut="getPlayerInOutByPosition(position).playerOut"
              :captainProfileId="
                isInitialRotationAssignment
                  ? selectedCaptain?.profileId ?? 0
                  : rotation?.inCourtCaptainProfileId ?? 0
              "
              :isInjured="
                hasRotationPlayerInjuryByPosition(position) ||
                isRotationPlayerInjuredByPosition(position)
              "
              :isPlayerOutInExtraordinaryChanges="
                isReplacementPlayerInInjuriesPlayerIn(
                  getPlayerInOutByPosition(position).playerOut?.profileId,
                )
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
              :playerInSanction="
                getPlayerSanction(getPlayerInOutByPosition(position).playerIn)
              "
              :playerOutSanction="
                getPlayerSanction(getPlayerInOutByPosition(position).playerOut)
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
        :maxChangesReached="
          totalPlayerChanges >= MAX_ROTATION_PLAYER_CHANGES /*  ||
          !availableBenchPlayers.length */
        "
        @remove:playerChange="setPlayerChangeToUndo"
        @undo:playerChange="setPlayerChangeToUndo"
      />

      <div
        v-if="!props.isInitialRotationAssignment && rotation?.injuries?.length"
        :class="{
          'mt-8': !!playerChanges.length || !!deniedPlayerChanges.length,
        }"
      >
        <header class="flex items-center gap-2 mb-3">
          <IconInjury size="1.25rem" />
          <p>{{ t('injuries.extraordinay_change', 2) }}</p>
        </header>

        <template v-for="injury in rotation.injuries">
          <RotationPlayerChangeItem
            v-if="mapInjuryToPlayerInOut(injury, props.call.playersData)"
            :playerIn="mapInjuryToPlayerInOut(injury, props.call.playersData)?.in!"
            :playerOut="mapInjuryToPlayerInOut(injury, props.call.playersData)?.out!"
          />
        </template>
      </div>

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
          :statusLabel="t('player_change_requests.request_denied', 2)"
        />

        <template v-for="deniedPlayerChange of deniedPlayerChanges">
          <RotationPlayerChangeItem
            v-if="
              mapDeniedPlayerChangeToPlayerInOut(
                deniedPlayerChange,
                props.call.playersData,
              )
            "
            :playerIn="mapDeniedPlayerChangeToPlayerInOut(deniedPlayerChange, props.call.playersData)?.in!"
            :playerOut="mapDeniedPlayerChangeToPlayerInOut(deniedPlayerChange, props.call.playersData)?.out!"
            :injured="deniedPlayerChange.injured"
          />
        </template>
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

  <!-- CHANGE --><DialogBottom
    class="easy-coach-rotation-players-dialog-component"
    :visible="!!selectedPosition"
    :hasStickyFooter="
      !!showPlayerChangeInjuryForm || !availableChangePlayers.length
    "
    @hide="handleHideCoachRotationPlayersDialog"
  >
    <template #header>
      <Heading class="flex gap-2" tag="h6">
        <IconInjury
          v-if="!!showPlayerChangeInjuryForm || !!playerChangeInjured"
          bordered
        />
        {{
          playerToReplace
            ? t('players.replace_player', {
                name: getFullName(playerToReplace),
              })
            : t('players.select')
        }}
      </Heading>
    </template>

    <div v-if="availableChangePlayers.length" class="mt-3">
      <RotationPlayerChangeItem
        v-if="!!injuryPlayerIn && !!injuryPlayerOut"
        :playerIn="injuryPlayerIn"
        :playerOut="injuryPlayerOut"
        injured
        block
      />
      <CoachRotationPlayer
        v-else
        v-for="player in availableChangePlayers"
        :key="player.profileId"
        :player="player"
        :sanction="getPlayerSanction(mapCallPlayerDataToPlayer(player))"
        @click="
          !!props.isInitialRotationAssignment
            ? addOrReplaceRotationPlayer(player)
            : !!showPlayerChangeInjuryForm
            ? addInjury(player)
            : changePlayer(player)
        "
      />

      <FormLabel
        v-if="!!showPlayerChangeInjuryForm"
        class="mt-4"
        :label="t('players.injury_reason')"
        required
      >
        <Textarea
          class="w-full"
          v-model="injuryFormRequestInjury.description"
          :rows="5"
          autoResize
        />
      </FormLabel>

      <FormLabel
        v-if="!!playerChangeInjured"
        class="mt-4"
        :label="t('players.injury_reason')"
        required
      >
        <Textarea
          class="w-full"
          v-model="playerChangeInjuryDescription"
          :rows="5"
          autoResize
        />
      </FormLabel>
    </div>
    <Message v-else :closable="false">
      {{ cannotReplacePlayersMessage }}
    </Message>

    <Button
      v-if="showExtraordinaryChangesButton"
      class="mt-4 w-full flex justify-center items-center"
      :outlined="!!showPlayerChangeInjuryForm"
      @click.prevent="toggleShowPlayerChangeInjuryForm"
    >
      <IconInjury class="absolute left-[0.65625rem]" bordered />
      {{ t('injuries.extraordinay_change') }}
    </Button>

    <CoachRotationPlayerChangeTypeButtons
      v-else-if="
        !props.isInitialRotationAssignment &&
        !showPlayerChangeInjuryForm &&
        availableChangePlayers.length
      "
      class="mt-4"
      :injured="!!playerChangeInjured"
      @injury="handleShowPlayerChangeInjuredForm"
    />

    <template
      v-if="!props.isInitialRotationAssignment && expelledPlayers.length"
    >
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

    <template v-if="!availableChangePlayers.length" #stickyFooter>
      <FormFooterActions
        :cancelLabel="t('forms.close')"
        hideSubmit
        @form:cancel="handleHideCoachRotationPlayersDialog"
      />
    </template>
    <template v-else-if="showPlayerChangeInjuryForm" #stickyFooter>
      <FormFooterActions
        :submitLabel="t('rotations.do_player_change')"
        @form:submit="handleAddInjury"
        @form:cancel="handleHideCoachRotationPlayersDialog"
      />
    </template>
  </DialogBottom>

  <!-- UNDO --><DialogBottom
    class="easy-coach-rotation-undo-player-change-dialog-component"
    :visible="showUndoPlayerChange"
    @hide="hideUndoPlayerChangeDialog"
  >
    <template #header>
      <Heading tag="h6">{{ submitLabel }}</Heading>
    </template>

    <template v-if="showPlayerChangeInjuryForm">
      <RotationPlayerChangeItem
        v-if="!!injuryPlayerIn && !!injuryPlayerOut"
        :playerIn="injuryPlayerIn"
        :playerOut="injuryPlayerOut"
        injured
        block
      />
      <CoachRotationPlayer
        v-else
        v-for="player in availableInjuryPlayers"
        :key="player.profileId"
        :player="player"
        :sanction="getPlayerSanction(mapCallPlayerDataToPlayer(player))"
        @click="addInjury(player)"
        hoverable
      />

      <FormLabel class="mt-4" :label="t('players.injury_reason')" required>
        <Textarea
          class="w-full"
          v-model="injuryFormRequestInjury.description"
          :rows="5"
          autoResize
        />
      </FormLabel>
    </template>
    <template v-else-if="playerChangeToUndo">
      <template
        v-if="injuredPlayerChangeToUndo && playerChangeToUndo.comesFromApi"
      >
        <template v-if="availableInjuryPlayers.length">
          <Message :closable="false" icon="undefined">
            {{ t('injuries.change_not_allowed_by_injury') }}
          </Message>

          <div class="flex items-center gap-3">
            <PlayerItem
              :player="injuredPlayerChangeToUndo"
              :showIcons="false"
              :showCaptain="!!injuredPlayerChangeToUndo.captain"
              :showLibero="!!injuredPlayerChangeToUndo.libero"
              :sanction="getPlayerSanction(injuredPlayerChangeToUndo)"
              :hoverable="false"
              :shirtNumberEditable="false"
            />
            <IconInjury />
          </div>
        </template>
        <Message v-else :closable="false">{{
          cannotReplacePlayersMessage
        }}</Message>
      </template>
      <Message
        v-else-if="
          isReplacementPlayerInInjuriesPlayerIn(playerChangeToUndo.profileId)
        "
        severity="warn"
        :closable="false"
      >
        {{ t('rotations.replacement_player_replacing_injured') }}
      </Message>
      <Message
        v-else-if="
          submitLabelAction !== 'cancel' &&
          mapPlayerChangeToChangeType(playerChangeToUndo) === ChangeType.SECOND
        "
        :closable="false"
      >
        {{
          t('rotations.max_player_change_changes_reached', {
            name: getFullName(
              getCallPlayerDataByProfileId(playerChangeToUndo.inCourtProfileId),
            ),
          })
        }}
      </Message>
      <CoachRotationPlayerChangeItem
        v-else
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
        :initialPlayerInjured="initialPlayerChangeToUndoInjured()"
        :playerInjured="replacementPlayerChangeToUndoInjured()"
        :type="initialPlayerChangeToUndo ? ChangeType.SECOND : ChangeType.FIRST"
        :changesCount="
          mapPlayerChangeToChangeType(
            initialPlayerChangeToUndo ?? playerChangeToUndo,
          )
        "
        block
      />
    </template>

    <FormLabel
      v-if="!!playerChangeInjured"
      class="mt-4"
      :label="t('players.injury_reason')"
      required
    >
      <Textarea
        class="w-full"
        v-model="playerChangeInjuryDescription"
        :rows="5"
        autoResize
      />
    </FormLabel>

    <Button
      v-if="
        submitLabelAction !== 'cancel' &&
        ((((playerChangeToUndo &&
          injuredPlayerChangeToUndo &&
          playerChangeToUndo.comesFromApi) ||
          mapPlayerChangeToChangeType(playerChangeToUndo) ===
            ChangeType.SECOND) &&
          !showPlayerChangeInjuryForm) ||
          isReplacementPlayerInInjuriesPlayerIn(
            playerChangeToUndo?.profileId,
          )) &&
        availableInjuryPlayers.length
      "
      class="mt-4 w-full flex justify-center items-center"
      :outlined="!!showPlayerChangeInjuryForm"
      @click.prevent="toggleShowPlayerChangeInjuryForm"
    >
      <IconInjury class="absolute left-[0.65625rem]" bordered />
      {{ t('injuries.extraordinay_change') }}
    </Button>
    <CoachRotationPlayerChangeTypeButtons
      v-else-if="
        submitLabelAction !== 'cancel' &&
        !showPlayerChangeInjuryForm &&
        !!playerChangeToUndo &&
        !!initialPlayerChangeToUndo &&
        playerChangeToUndo.inCourtProfileId ===
          initialPlayerChangeToUndo.inCourtProfileId &&
        ((initialPlayerChangeToUndo.comesFromApi &&
          (initialPlayerChangeToUndo.replacementProfileId ===
            initialPlayerChangeToUndo.profileId ||
            availableChangePlayers.length)) ||
          !initialPlayerChangeToUndo.comesFromApi)
      "
      class="mt-5"
      :injured="!!playerChangeInjured"
      @injury="handleShowPlayerChangeInjuredForm"
    />

    <template #stickyFooter>
      <Button
        v-if="
          submitLabelAction !== 'injury' &&
          injuredPlayerChangeToUndo &&
          playerChangeToUndo?.comesFromApi &&
          !showPlayerChangeInjuryForm &&
          availableChangePlayers.length
        "
        class="mt-4 w-full flex justify-center items-center"
        :outlined="!!showPlayerChangeInjuryForm"
        @click.prevent="toggleShowPlayerChangeInjuryForm"
      >
        <IconInjury class="absolute left-[0.65625rem]" bordered />
        {{ t('injuries.extraordinay_change') }}
      </Button>
      <FormFooterActions
        v-else-if="
          showPlayerChangeInjuryForm && playerChangeToUndo?.comesFromApi
        "
        :submitLabel="t('rotations.do_player_change')"
        @form:submit="handleAddInjury"
        @form:cancel="handleHideCoachRotationPlayersDialog"
      />
      <FormFooterActions
        v-else
        :submitLabel="submitLabel"
        :cancelLabel="
          !availableChangePlayers.length ? t('forms.close') : undefined
        "
        :hideSubmit="
          submitLabelAction !== 'cancel'
            ? (!!injuredPlayerChangeToUndo &&
                playerChangeToUndo?.comesFromApi) ||
              (playerChangeToUndo &&
                playerChangeToUndo.inCourtProfileId ===
                  playerChangeToUndo.profileId) ||
              isReplacementPlayerInInjuriesPlayerIn(
                playerChangeToUndo?.profileId,
              )
            : false
        "
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
