<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'

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
})
</script>

<template>
  <div
    class="easy-player-change-item-component gap-3 mb-2"
    :class="{ 'is-mini': props.mini, 'is-block': !props.mini && props.block }"
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
  </div>
</template>

<script lang="ts">
export default {
  name: 'RotationPlayerChangeItem',
}
</script>
