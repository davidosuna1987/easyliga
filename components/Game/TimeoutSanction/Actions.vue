<script setup lang="ts">
import { Coach, Team, TeamMember, TeamSide, TeamSideEnum } from '@/domain/team'
import { Set } from '@/domain/set'

const props = defineProps({
  leftSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  rightSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  leftSideTeamMembers: {
    type: Array as PropType<TeamMember[]>,
    required: true,
  },
  rightSideTeamMembers: {
    type: Array as PropType<TeamMember[]>,
    required: true,
  },
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
})

const sideTeamToSanction = ref<TeamSide>()
const sideTeamToSetTimeout = ref<TeamSide>()

const teamToSanction = computed((): Team | undefined => {
  switch (sideTeamToSanction.value) {
    case TeamSideEnum.left:
      return props.leftSideTeam
    case TeamSideEnum.right:
      return props.rightSideTeam
    default:
      return undefined
  }
})

const teamMembersToSanction = computed((): TeamMember[] => {
  switch (sideTeamToSanction.value) {
    case TeamSideEnum.left:
      return props.leftSideTeamMembers
    case TeamSideEnum.right:
      return props.rightSideTeamMembers
    default:
      return []
  }
})

const teamCoachToSanction = computed((): Coach | undefined => {
  if (!teamToSanction.value) return undefined
  return teamToSanction.value.coach
})

const teamToSetTimeout = computed((): Team | undefined => {
  switch (sideTeamToSetTimeout.value) {
    case TeamSideEnum.left:
      return props.leftSideTeam
    case TeamSideEnum.right:
      return props.rightSideTeam
    default:
      return undefined
  }
})
</script>

<template>
  <div class="game-timeout-sanction-actions-component flex justify-between">
    <div class="flex gap-3">
      <Button class="p-3" rounded>
        <Icon name="material-symbols:alarm" size="1.5rem" />
      </Button>
      <Button
        class="p-3"
        rounded
        @click="sideTeamToSanction = TeamSideEnum.left"
      >
        <Icon name="mdi:cards" size="1.5rem" />
      </Button>
    </div>

    <div class="flex gap-3">
      <Button
        class="p-3"
        rounded
        @click="sideTeamToSanction = TeamSideEnum.right"
      >
        <Icon name="mdi:cards" size="1.5rem" />
      </Button>
      <Button class="p-3" rounded>
        <Icon name="material-symbols:alarm" size="1.5rem" />
      </Button>
    </div>

    <GameTimeoutSanctionDialog
      v-if="teamToSanction"
      :visible="!!teamToSanction"
      :team="teamToSanction"
      :members="teamMembersToSanction"
      @hide="sideTeamToSanction = undefined"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameTimeoutSanctionActions',
}
</script>
