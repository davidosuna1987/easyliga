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
})

const emit = defineEmits(['set:start'])

const showStartSetDialog = ref<boolean>(false)

const startSet = (setStartRequest: SetStartRequest) => {
  showStartSetDialog.value = false
  emit('set:start', setStartRequest)
}
</script>

<template>
  <div class="easy-game-set-actions-component">
    <div class="actions grid place-content-center">
      <Button
        class="px-12"
        :label="$t('sets.start')"
        outlined
        @click="showStartSetDialog = true"
      />
    </div>

    <DialogBottom
      class="easy-game-set-start-dialog-component"
      :visible="!!showStartSetDialog"
      @hide="showStartSetDialog = false"
    >
      <template #header>
        <Heading tag="h6">{{ $t('sets.start') }}</Heading>
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
