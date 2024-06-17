<script setup lang="ts">
import { Set, SetStartRequest } from '@/domain/set'
import { Team } from '@/domain/team'

const props = defineProps({
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
  leftSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  rightSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'set:start', value: SetStartRequest): void
}>()

const { t } = useI18n()
const showStartSetDialog = ref<boolean>(false)

const actionLabel = computed(() =>
  t(props.disabled ? 'rotations.waiting' : 'sets.start', 2),
)

const handleClick = () => {
  if (props.disabled) return

  if (props.currentSet.number === 1) {
    showStartSetDialog.value = true
  } else {
    const { localTeamSide, visitorTeamSide, firstServeTeamId } =
      props.currentSet

    if (!localTeamSide || !visitorTeamSide || !firstServeTeamId) return

    startSet({ localTeamSide, visitorTeamSide, firstServeTeamId })
  }
}

const startSet = (setStartRequest: SetStartRequest) => {
  showStartSetDialog.value = false
  emit('set:start', setStartRequest)
}
</script>

<template>
  <div class="easy-game-set-actions-component">
    <EasyGrid class="actions" center>
      <Button
        class="px-12"
        :label="actionLabel"
        outlined
        :loading="disabled"
        :disabled="disabled"
        @click="handleClick"
      />
    </EasyGrid>

    <DialogBottom
      class="easy-game-set-start-dialog-component"
      :visible="!!showStartSetDialog"
      @hide="showStartSetDialog = false"
    >
      <template #header>
        <Heading tag="h6">{{ t('sets.start') }}</Heading>
      </template>

      <SetStartForm
        class="mt-8"
        :leftSideTeam="leftSideTeam"
        :rightSideTeam="rightSideTeam"
        @set:start="startSet"
      />
    </DialogBottom>
  </div>
</template>

<style scoped></style>
