<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'
import { getFullName } from '@/domain/player'

const props = defineProps({
  playersData: {
    type: Array as PropType<CallPlayerData[]>,
    required: true,
  },
})
</script>

<template>
  <Message :closable="false" severity="error">
    {{
      $t(
        'sanctions.player_change_needed',
        {
          name: getFullName(props.playersData[0]),
        },
        props.playersData.length,
      )
    }}
  </Message>
</template>

<script lang="ts">
export default {
  name: 'RotationPlayerSanctionedMessage',
}
</script>
