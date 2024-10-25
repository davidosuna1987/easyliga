<script setup lang="ts">
import { PlayerChangeType, PLAYER_CHANGE_TYPES } from '@/domain/rotation'

const props = defineProps({
  injured: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'injury', value: boolean): void
}>()

const { t } = useI18n()
</script>

<template>
  <EasyGrid class="mt-4" :cols="2" :gap="3">
    <Button
      class="flex justify-center items-center"
      :outlined="!!props.injured"
      size="small"
      @click.prevent="emit('injury', false)"
    >
      <EasyIcon
        :class="[
          'absolute left-[0.65625rem] text-success',
          {
            'rounded-full [background:var(--background-color)]': !props.injured,
          },
        ]"
        name="playerChangeDone"
        size="1.7rem"
        bordered
      />
      <span class="pl-4">{{ t('injuries.elegible_player') }}</span>
    </Button>
    <Button
      class="flex justify-center items-center"
      :outlined="!props.injured"
      size="small"
      @click.prevent="emit('injury', true)"
    >
      <IconInjury class="absolute left-[0.65625rem]" bordered />
      <span class="pl-4">{{ t('injuries.player') }}</span>
    </Button>
  </EasyGrid>
</template>

<script lang="ts">
export default {
  name: 'CoachRotationPlayerChangeTypeButtons',
}
</script>
