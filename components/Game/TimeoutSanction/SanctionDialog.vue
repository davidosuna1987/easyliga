<script setup lang="ts">
import {
  SanctionType,
  SanctionTypeKey,
  SanctionSeverityKey,
  SanctionStoreRequest,
} from '@/domain/sanction'
import { Team, TeamMember } from '@/domain/team'
import { getFullName } from '@/domain/player'

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
})

const emit = defineEmits(['hide'])

const app = useNuxtApp()
const toast = useEasyToast()

const showDialog = ref<boolean>(props.visible)
const sanctionType = ref<SanctionTypeKey | undefined>(props.type)
const selectedMember = ref<TeamMember>()

const form = ref<SanctionStoreRequest>()
const showEnsureSubmitSanction = ref<boolean>(false)

const isValidSanctionedTeam = computed(
  (): boolean =>
    sanctionType.value === SanctionType.team && !!form.value?.teamId,
)

const isValidSanctionedMember = computed(
  (): boolean =>
    sanctionType.value === SanctionType.member &&
    (!!form.value?.playerProfileId || !!form.value?.coachProfileId),
)

const isValidForm = computed(
  (): boolean =>
    !!form.value &&
    !!form.value.severity &&
    !!form.value.type &&
    (isValidSanctionedTeam.value || isValidSanctionedMember.value),
)

const nameToSanction = computed((): string =>
  sanctionType.value === SanctionType.team
    ? props.team.name
    : getFullName(selectedMember.value as TeamMember),
)

const hide = () => {
  sanctionType.value = SanctionType.team
  selectedMember.value = undefined
  form.value = undefined
  emit('hide')
}

const setSanctionType = (type: SanctionTypeKey) => {
  selectedMember.value = undefined
  sanctionType.value = type
  form.value = undefined
  form.value = {
    type,
    severity: undefined,
    teamId: type === SanctionType.team ? props.team.id : undefined,
  }
}

const setSelectedMember = (member: TeamMember) => {
  selectedMember.value = member
  console.log({ member })

  form.value = {
    ...form.value,
    playerProfileId: member.coach ? undefined : member.profileId,
    coachProfileId: member.coach ? member.profileId : undefined,
  }

  console.log({ form: form.value })
}

const handleSeveritySelected = (severity: SanctionSeverityKey) => {
  form.value = {
    ...form.value,
    type: sanctionType.value,
    severity,
  }
}

const ensureSubmitSanction = () => {
  console.log(form.value)
  if (!isValidForm.value) {
    toast.error(app.$i18n.t('sanctions.invalid_form'))
    return
  }

  showEnsureSubmitSanction.value = true
}

const submitSanction = () => {
  if (!form.value) return
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
      <template v-if="sanctionType === SanctionType.member && selectedMember">
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
          :outlined="sanctionType !== key"
          @click="setSanctionType(key)"
        >
          <!-- <Icon :name="SanctionIcon[key]" size="1.5rem" class="mr-1" /> -->
          {{ $t(`sanctions.${key}_user_friendly`) }}
        </Button>
      </nav>

      <SanctionGrid
        v-if="sanctionType === SanctionType.team"
        class="mt-6"
        :type="sanctionType"
        @sanction:selected="handleSeveritySelected"
      />
      <template v-if="sanctionType === SanctionType.member">
        <TeamMemberSelector
          class="mt-6 w-full"
          :member="props.member"
          :members="props.members"
          @member:selected="setSelectedMember"
        />

        <SanctionGrid
          class="mt-6"
          :type="sanctionType"
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
  name: 'GameSanctionDialog',
}
</script>
