<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'
import { ChangeAction, ChangeActionIcon } from '@/domain/rotation'

const props = defineProps({
  playerIn: {
    type: Object as PropType<CallPlayerData>,
    required: true,
  },
  playerOut: {
    type: Object as PropType<CallPlayerData>,
    required: true,
  },
  mini: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  action: {
    type: String as PropType<ChangeAction>,
    required: false,
  },
})

const emit = defineEmits(['change:remove'])

const onActionClick = () => {
  if (props.action === 'remove') {
    emit('change:remove')
  }
}
</script>

<template>
  <div
    class="easy-player-change-item-component gap-3 mb-2"
    :class="{
      'is-mini': props.mini,
      'is-block': !props.mini && props.block,
      'has-actions': props.action,
    }"
  >
    <div class="player-container">
      <IconShirtNumber
        v-if="props.mini"
        :shirtNumber="playerIn.shirtNumber"
        size="lg"
      />
      <PlayerItem
        v-else
        :player="playerIn"
        :showCaptain="false"
        :showLibero="false"
        :showIcons="false"
        :selectable="false"
        :showAvatar="false"
      />
    </div>
    <img class="arrows-icon" src="/icons/change-player.svg" width="40" />
    <div class="player-container">
      <IconShirtNumber
        v-if="props.mini"
        :shirtNumber="playerOut.shirtNumber"
        size="lg"
      />
      <PlayerItem
        v-else
        :player="playerOut"
        :showCaptain="false"
        :showLibero="false"
        :showIcons="false"
        :selectable="false"
        :showAvatar="false"
      />
    </div>
    <div v-if="props.action" class="actions">
      <Icon
        class="action"
        :class="[`action-${props.action}`]"
        :name="ChangeActionIcon[props.action]"
        size="1.5rem"
        @click="onActionClick()"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RotationPlayerChangeItem',
}
</script>
