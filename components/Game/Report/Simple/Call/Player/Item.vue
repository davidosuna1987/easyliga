<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'
import { getFullName } from '@/domain/player'

const props = defineProps({
  player: {
    type: Object as PropType<CallPlayerData>,
    required: false,
  },
})
</script>

<template>
  <div
    class="col-span-1 border-solid border-t-0 grid place-content-center h-[29.5px]"
  >
    <template v-if="player">
      <IconShirtNumber
        class="no-print"
        :shirtNumber="player.shirtNumber"
        size="sm"
      />
      <div class="print text-center w-8 font-bold">
        {{ player.shirtNumber }}
      </div>
    </template>
    <span v-else>&nbsp;</span>
  </div>
  <div
    class="col-span-5 p-2 border-solid border-t-0 border-x-0 flex items-center h-[29.5px]"
  >
    <span v-if="player">{{ getFullName(player) }}</span>
    <span v-else>&nbsp;</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleCallPlayerItem',
}
</script>
