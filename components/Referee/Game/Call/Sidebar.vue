<script setup lang="ts">
import { Team } from '@/domain/team'
import { Set } from '@/domain/set'
import { Call } from '@/domain/call'
import { Rotation } from '@/domain/rotation'

const props = defineProps({
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
  rotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
})

const inCourtPlayers = computed(() => {
  const inCourtPlayerIds = props.rotation?.players.map(
    rotation => rotation.inCourtProfileId,
  )

  return props.call.playersData.filter(player =>
    inCourtPlayerIds?.includes(player.profileId),
  )
})

const benchPlayers = computed(() => {
  const inCourtPlayerIds = props.rotation?.players.map(
    rotation => rotation.inCourtProfileId,
  )
  return props.call.playersData.filter(
    player => !inCourtPlayerIds?.includes(player.profileId),
  )
})
</script>

<template>
  <div class="easy-game-call-sidebar-component">
    <template v-if="props.rotation && props.rotation.players.length === 6">
      <Heading tag="h6">{{ $t('rotations.in_court') }}</Heading>
      <PlayerItem
        v-for="player in inCourtPlayers"
        :key="player.profileId"
        :player="player"
        :showIcons="false"
        :showCaptain="player.captain"
        :showLibero="player.libero"
      />
      <template v-if="benchPlayers.length">
        <Heading tag="h6">{{ $t('rotations.bench') }}</Heading>
        <PlayerItem
          v-for="player in benchPlayers"
          :key="player.profileId"
          :player="player"
          :showIcons="false"
          :showCaptain="player.captain"
          :showLibero="player.libero"
        />
      </template>
    </template>
    <template v-else>
      <Heading tag="h6">{{ $t('calls.call') }}</Heading>
      <PlayerItem
        v-for="player in props.call.playersData"
        :key="player.profileId"
        :player="player"
        :showIcons="false"
        :showCaptain="player.captain"
        :showLibero="player.libero"
      />
      <div class="call-status-area p-[0.5rem]">
        <RefereeGameCallStatus
          :call="props.call"
          :currentSet="props.currentSet"
          @unlocked:call="$emit('unlocked:call', true)"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameCallSidebar',
}
</script>
