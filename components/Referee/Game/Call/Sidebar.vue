<script setup lang="ts">
import { Team } from '@/domain/team'
import { Call } from '@/domain/call'

const props = defineProps({
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
})

const showMessage = true

const inCourtPlayers = computed(() => {
  const inCourtPlayerIds = props.call.currentRotation?.players.map(
    rotation => rotation.inCourtProfileId,
  )

  return props.call.playersData.filter(player =>
    inCourtPlayerIds?.includes(player.profileId),
  )
})

const benchPlayers = computed(() => {
  const inCourtPlayerIds = props.call.currentRotation?.players.map(
    rotation => rotation.inCourtProfileId,
  )
  return props.call.playersData.filter(
    player => !inCourtPlayerIds?.includes(player.profileId),
  )
})
</script>

<template>
  <div class="easy-game-call-sidebar-component">
    <template
      v-if="
        props.call.currentRotation &&
        props.call.currentRotation.players.length === 6
      "
    >
      <Heading tag="h6">{{ $t('rotations.in_court') }}</Heading>
      <RefereeGameCallItem
        v-for="player in inCourtPlayers"
        :key="player.profileId"
        :player="player"
      />
      <template v-if="benchPlayers.length">
        <Heading tag="h6">{{ $t('rotations.bench') }}</Heading>
        <RefereeGameCallItem
          v-for="player in benchPlayers"
          :key="player.profileId"
          :player="player"
        />
      </template>
    </template>
    <template v-else>
      <Heading tag="h6">{{ $t('calls.call') }}</Heading>
      <RefereeGameCallItem
        v-for="player in props.call.playersData"
        :key="player.profileId"
        :player="player"
      />
      <div class="call-status-area p-[0.5rem]">
        <RefereeGameCallStatus
          :call="props.call"
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
