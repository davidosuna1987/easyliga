<script setup lang="ts">
import { getFullName } from '@/domain/player'
import { Sanction } from '@/domain/sanction'
import { TeamMember } from '@/domain/team'

const props = defineProps({
  coach: {
    type: Object as PropType<TeamMember>,
    required: true,
  },
  showAvatar: {
    type: Boolean,
    default: true,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  sanction: {
    type: Object as PropType<Sanction>,
    required: false,
  },
})
</script>

<template>
  <div class="easy-game-coach-item easy-game-player-item">
    <div class="team-player-info">
      <SanctionItem
        v-if="props.sanction"
        :severity="props.sanction.severity"
        size="1rem"
      />
      <Avatar
        v-if="showAvatar"
        class="player-avatar"
        :image="coach.avatar"
        shape="circle"
      />
      <IconShirtNumber :shirtNumber="$t('coaches.coach_one_char')" />
      <span class="player-name">{{ getFullName(coach) }}</span>
    </div>
    <div
      v-if="showIcon"
      class="team-player-captain grid gap-2 grid-cols-1"
    ></div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachItem',
}
</script>
