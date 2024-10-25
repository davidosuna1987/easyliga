<script setup lang="ts">
import GameService from '@/services/game'
import SanctionService from '@/services/sanction'
import {
  SanctionType,
  SanctionTypeKey,
  SanctionSeverityKey,
  SanctionStoreRequest,
  getAvailableTeamSanctionSeverities,
  getAvailableMemberSanctionSeverities,
  SanctionMember,
  SanctionMemberKey,
  mapApiSanctionToSanction,
  Sanction,
  mergeSanctionsRemovingDuplicates,
  EXPULSION_SEVERITIES,
} from '@/domain/sanction'
import { Team, TeamMember } from '@/domain/team'
import { getFullName } from '@/domain/player'
import { Set } from '@/domain/set'
import { Injury } from '@/domain/injury'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String as PropType<SanctionTypeKey>,
    required: false,
  },
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
  member: {
    type: Object as PropType<TeamMember>,
    required: false,
  },
  members: {
    type: Array as PropType<TeamMember[]>,
    required: true,
  },
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
  gameSanctions: {
    type: Array as PropType<Sanction[]>,
    required: false,
  },
  injuries: {
    type: Array as PropType<Injury[]>,
    default: [],
  },
})

const emit = defineEmits<{
  (e: 'hide', value: boolean): void
  (e: 'sanction:stored', sanction: Sanction): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const sanctionService = new SanctionService()
const gameService = new GameService()

const showDialog = ref<boolean>(props.visible)
const selectedType = ref<SanctionTypeKey | undefined>(props.type)
const selectedMember = ref<TeamMember>()
const selectedSeverity = ref<SanctionSeverityKey>()
const showObservations = ref<boolean>(false)
const observations = ref<string>()

const showEnsureSubmitSanction = ref<boolean>(false)
const showGameTeamIncomplete = ref<boolean>(false)
const showCurrentSetTeamIncomplete = ref<boolean>(false)
const loadingIncompleteTeam = ref<boolean>(false)
const loadingApi = ref<boolean>(false)

const form = computed((): SanctionStoreRequest => {
  return {
    type: selectedType.value,
    severity: selectedSeverity.value,
    playerProfileId: selectedMember.value?.coach
      ? undefined
      : selectedMember.value?.profileId,
    coachProfileId: selectedMember.value?.coach
      ? selectedMember.value?.profileId
      : undefined,
    teamId: props.team.id,
    setId: props.currentSet.id,
    observations: observations.value,
  }
})

const isValidSanctionedTeam = computed(
  (): boolean =>
    selectedType.value === SanctionType.team && !!form.value?.teamId,
)

const isValidSanctionedMember = computed(
  (): boolean =>
    selectedType.value === SanctionType.member &&
    (!!form.value?.playerProfileId || !!form.value?.coachProfileId),
)

const isValidForm = computed(
  (): boolean =>
    !!form.value &&
    !!form.value.severity &&
    !!form.value.type &&
    (isValidSanctionedTeam.value || isValidSanctionedMember.value),
)

const nameToSanction = computed((): string | undefined =>
  selectedType.value === SanctionType.team
    ? props.team.name
    : getFullName(selectedMember.value),
)

const setSanctions = computed((): Sanction[] =>
  mergeSanctionsRemovingDuplicates(
    props.currentSet.sanctions ?? [],
    props.gameSanctions ?? [],
  ),
)

const availableSeverities = computed((): SanctionSeverityKey[] => {
  switch (selectedType.value) {
    case SanctionType.team:
      return getAvailableTeamSanctionSeverities(
        setSanctions.value,
        form.value.setId,
        form.value.teamId,
      )
    case SanctionType.member:
      return getAvailableMemberSanctionSeverities(
        setSanctions.value,
        form.value.setId,
        form.value.teamId,
        form.value.playerProfileId ?? form.value.coachProfileId,
        form.value.playerProfileId
          ? (SanctionMember.player as SanctionMemberKey)
          : (SanctionMember.coach as SanctionMemberKey),
      )
    default:
      return []
  }
})

const submitLabel = computed((): string =>
  showEnsureSubmitSanction.value
    ? t('sanctions.to_sanction_name', { name: nameToSanction.value })
    : t('sanctions.to_sanction'),
)

const submitSeverity = computed((): string | undefined =>
  showEnsureSubmitSanction.value
    ? loadingIncompleteTeam.value
      ? 'info'
      : 'danger'
    : undefined,
)

const loadingDialog = computed(
  (): boolean =>
    showEnsureSubmitSanction.value &&
    (loadingIncompleteTeam.value || loadingApi.value),
)

const selectedMemberInjured = computed((): boolean =>
  props.injuries.some(
    injury => injury.profileId === selectedMember?.value?.profileId,
  ),
)

const hide = () => {
  selectedType.value = SanctionType.team
  selectedMember.value = undefined
  emit('hide', true)
}

const setSanctionType = (type: SanctionTypeKey) => {
  selectedMember.value = undefined
  selectedType.value = type
}

const setSelectedMember = (member: TeamMember) => {
  selectedMember.value = member
}

const handleSeveritySelected = (severity: SanctionSeverityKey) => {
  selectedSeverity.value = severity
}

const ensureSubmitSanction = async () => {
  if (!isValidForm.value) {
    toast.error(t('sanctions.invalid_form'))
    return
  }

  showEnsureSubmitSanction.value = true

  if (
    selectedMember.value &&
    !selectedMember.value.coach &&
    selectedType.value === SanctionType.member &&
    selectedSeverity.value &&
    EXPULSION_SEVERITIES.includes(selectedSeverity.value)
  ) {
    loadingIncompleteTeam.value = true

    const { data, error } = await gameService.teamIncomplete(
      props.currentSet.gameId,
      props.team.id,
      {
        type: selectedType.value,
        severity: selectedSeverity.value,
        player_profile_id: selectedMember.value.profileId,
      },
    )

    loadingIncompleteTeam.value = false

    if (error.value || !data.value) {
      toast.mapError(Object.values(error.value?.data?.errors), false)
      return
    }

    if (data.value.data.incomplete.current_set) {
      showCurrentSetTeamIncomplete.value = true
    }

    if (data.value.data.incomplete.game) {
      showGameTeamIncomplete.value = true
    }
  }
}

const submitSanction = async () => {
  if (!isValidForm.value) {
    toast.error(t('sanctions.invalid_form'))
    return
  }

  loadingApi.value = true
  const { data, error } = await sanctionService.store(form.value)
  loadingApi.value = false

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  toast.success(
    t('sanctions.sanctioned.default', {
      name: nameToSanction.value,
    }),
  )

  emit('sanction:stored', mapApiSanctionToSanction(data.value.data.sanction))

  hide()
}

const handleSubmitSanction = () =>
  showEnsureSubmitSanction.value ? submitSanction() : ensureSubmitSanction()

watch(
  () => props.visible,
  value => (showDialog.value = value),
)

watch(
  () => props.type,
  value => {
    if (value) setSanctionType(value)
  },
)

onMounted(() => {
  if (!props.type) setSanctionType(SanctionType.team)
  if (props.member) setSelectedMember(props.member)
})
</script>

<template>
  <DialogBottom
    class="easy-game-sanction-dialog-component"
    :visible="!!showDialog"
    @hide="hide"
  >
    <template #header>
      <Heading tag="h6">{{ t('sanctions.to_sanction') }}</Heading>
    </template>

    <div v-if="showEnsureSubmitSanction" class="flex flex-col items-center">
      <p class="text-center my-3">{{ t('sanctions.store_disclaimer') }}</p>
      <Heading tag="h5" class="mt-3">
        {{ props.team.name }}
      </Heading>
      <template v-if="selectedType === SanctionType.member && selectedMember">
        <CoachItem
          v-if="selectedMember.coach"
          class="pointer-events-none w-min whitespace-nowrap"
          :coach="selectedMember"
        />
        <PlayerItem
          v-else
          class="pointer-events-none w-min whitespace-nowrap"
          :player="selectedMember"
          :injured="selectedMemberInjured"
          :selectable="false"
          :showIcons="false"
          :showCaptain="false"
          :showLibero="false"
        />
      </template>
      <SanctionItem
        v-if="form?.severity"
        class="pointer-events-none"
        :severity="form.severity"
      />

      <div class="mt-6 w-full">
        <Textarea
          v-if="showObservations"
          class="w-full"
          v-model="observations"
          :rows="5"
          autoResize
          :placeholder="t('observations.record')"
        />
        <a
          v-else
          class="cursor-pointer text-primary text-center block w-full"
          @click="showObservations = true"
        >
          {{ t('observations.record') }}
        </a>
      </div>
      <div class="mt-6 -mb-10 w-full">
        <Message
          v-if="showGameTeamIncomplete || showCurrentSetTeamIncomplete"
          :closable="false"
          severity="error"
          :icon="undefined"
        >
          {{
            t(
              `sanctions.${
                showGameTeamIncomplete ? 'game' : 'current_set'
              }_team_incomplete`,
            )
          }}
        </Message>
      </div>
    </div>
    <template v-else>
      <EasyGrid
        v-if="!props.type"
        class="sanction-navbarmt-2"
        :cols="2"
        :gap="3"
      >
        <Button
          v-for="key in SanctionType"
          :key="key"
          class="sanction-navbar-item flex items-center justify-center"
          :outlined="selectedType !== key"
          @click="setSanctionType(key)"
        >
          <!-- <Icon :name="SanctionIcon[key]" size="1.5rem" class="mr-1" /> -->
          {{ t(`sanctions.${key}_user_friendly`) }}
        </Button>
      </EasyGrid>

      <SanctionGrid
        v-if="selectedType === SanctionType.team"
        class="mt-6"
        :type="SanctionType.team"
        :availableSeverities="availableSeverities"
        @sanction:selected="handleSeveritySelected"
      />
      <template v-if="selectedType === SanctionType.member">
        <TeamMemberSelector
          class="mt-6 w-full"
          :currentSet="props.currentSet"
          :team="props.team"
          :member="props.member"
          :members="props.members"
          :setSanctions="setSanctions"
          :injuries="props.injuries"
          @member:selected="setSelectedMember"
        />

        <SanctionGrid
          class="mt-6"
          :type="SanctionType.member"
          :availableSeverities="availableSeverities"
          @sanction:selected="handleSeveritySelected"
        />
      </template>
    </template>

    <template #stickyFooter>
      <FormFooterActions
        :submitClass="
          showEnsureSubmitSanction
            ? ['w-full transition-none', ...[loadingDialog ? 'grayscale' : '']]
            : undefined
        "
        :submitLabel="submitLabel"
        :submitSeverity="submitSeverity"
        :size="showEnsureSubmitSanction ? 'large' : undefined"
        :disabled="loadingDialog"
        :loading="loadingDialog"
        :hideCancel="showEnsureSubmitSanction"
        @form:submit="handleSubmitSanction"
        @form:cancel="hide"
      />
    </template>
  </DialogBottom>
</template>

<style scoped lang="scss">
.p-dialog .p-dialog-footer button.ensure-sanction-button {
  width: 100%;
}
</style>

<script lang="ts">
export default {
  name: 'SanctionDialog',
}
</script>
