<script setup lang="ts">
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
} from '@/domain/sanction'
import { Team, TeamMember } from '@/domain/team'
import { getFullName } from '@/domain/player'
import { Set } from '@/domain/set'
import SanctionService from '@/services/sanction'

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
})

const emit = defineEmits(['hide', 'sanction:stored'])

const app = useNuxtApp()
const toast = useEasyToast()

const sanctionService = new SanctionService()

const showDialog = ref<boolean>(props.visible)
const selectedType = ref<SanctionTypeKey | undefined>(props.type)
const selectedMember = ref<TeamMember>()
const selectedSeverity = ref<SanctionSeverityKey>()
const showObservations = ref<boolean>(false)
const observations = ref<string>()

const showEnsureSubmitSanction = ref<boolean>(false)

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

const hide = () => {
  selectedType.value = SanctionType.team
  selectedMember.value = undefined
  emit('hide')
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

const ensureSubmitSanction = () => {
  if (!isValidForm.value) {
    toast.error(app.$i18n.t('sanctions.invalid_form'))
    return
  }

  showEnsureSubmitSanction.value = true
}

const submitSanction = async () => {
  if (!isValidForm.value) {
    toast.error(app.$i18n.t('sanctions.invalid_form'))
    return
  }

  const { data, error } = await sanctionService.store(form.value)

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  toast.success(
    app.$i18n.t('sanctions.sanctioned.default', {
      name: nameToSanction.value,
    }),
  )

  emit('sanction:stored', mapApiSanctionToSanction(data.value.data.sanction))

  hide()
}

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
      <Heading tag="h6">{{ $t('sanctions.to_sanction') }}</Heading>
    </template>

    <div v-if="showEnsureSubmitSanction" class="flex flex-col items-center">
      <p class="text-center my-3">{{ $t('sanctions.store_disclaimer') }}</p>
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
          :placeholder="$t('observations.record')"
        />
        <a
          v-else
          class="cursor-pointer text-primary text-center block w-full"
          @click="showObservations = true"
        >
          {{ $t('observations.record') }}
        </a>
      </div>
    </div>
    <template v-else>
      <nav
        v-if="!props.type"
        class="sanction-navbar grid grid-cols-2 gap-3 mt-2"
      >
        <Button
          v-for="key in SanctionType"
          :key="key"
          class="sanction-navbar-item flex items-center justify-center"
          :outlined="selectedType !== key"
          @click="setSanctionType(key)"
        >
          <!-- <Icon :name="SanctionIcon[key]" size="1.5rem" class="mr-1" /> -->
          {{ $t(`sanctions.${key}_user_friendly`) }}
        </Button>
      </nav>

      <SanctionGrid
        v-if="selectedType === SanctionType.team"
        class="mt-6"
        :type="selectedType"
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
          @member:selected="setSelectedMember"
        />

        <SanctionGrid
          class="mt-6"
          :type="selectedType"
          :availableSeverities="availableSeverities"
          @sanction:selected="handleSeveritySelected"
        />
      </template>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 mt-3">
        <Button
          v-if="showEnsureSubmitSanction"
          class="ensure-sanction-button"
          :label="$t('sanctions.to_sanction_name', { name: nameToSanction })"
          severity="danger"
          size="large"
          @click="submitSanction"
        />
        <template v-else>
          <Button
            class="grayscale"
            :label="$t('forms.cancel')"
            severity="info"
            outlined
            @click="hide"
          />
          <Button
            :label="$t('sanctions.to_sanction')"
            @click="ensureSubmitSanction"
          />
        </template>
      </div>
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
