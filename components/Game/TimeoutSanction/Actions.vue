<script setup lang="ts">
import { Coach, Team, TeamMember, TeamSide, TeamSideEnum } from '@/domain/team'
import { Set } from '@/domain/set'
import { GameStatus } from '@/domain/game'
import { Timeout } from '@/domain/timeout'

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
  leftSideTeamTimeouts: {
    type: Array as PropType<Timeout[]>,
    required: true,
  },
  rightSideTeamTimeouts: {
    type: Array as PropType<Timeout[]>,
    required: true,
  },
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
  gameStatus: {
    type: String as PropType<GameStatus>,
    required: true,
  },
})

const emit = defineEmits(['timeout:init'])

const sideTeamToSanction = ref<TeamSide>()
const sideTeamToTimeout = ref<TeamSide>()

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

const teamToTimeout = computed((): Team | undefined => {
  switch (sideTeamToTimeout.value) {
    case TeamSideEnum.left:
      return props.leftSideTeam
    case TeamSideEnum.right:
      return props.rightSideTeam
    default:
      return undefined
  }
})

const teamToTimeoutTimeouts = computed((): Timeout[] => {
  switch (sideTeamToTimeout.value) {
    case TeamSideEnum.left:
      return props.leftSideTeamTimeouts ?? []
    case TeamSideEnum.right:
      return props.rightSideTeamTimeouts ?? []
    default:
      return []
  }
})
</script>

<template>
  <div class="game-timeout-sanction-actions-component flex justify-between">
    <div class="flex gap-3">
      <Button
        class="p-3"
        rounded
        @click="sideTeamToTimeout = TeamSideEnum.left"
      >
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
      <Button
        class="p-3"
        rounded
        @click="sideTeamToTimeout = TeamSideEnum.right"
      >
        <Icon name="material-symbols:alarm" size="1.5rem" />
      </Button>
    </div>

    <SanctionDialog
      v-if="teamToSanction"
      :visible="!!teamToSanction"
      :team="teamToSanction"
      :members="teamMembersToSanction"
      :currentSet="currentSet"
      @hide="sideTeamToSanction = undefined"
    />
    <TimeoutDialog
      v-if="props.gameStatus === 'playing' && teamToTimeout"
      :visible="!!teamToTimeout"
      :team="teamToTimeout"
      :timeouts="teamToTimeoutTimeouts"
      :currentSet="props.currentSet"
      @timeout:init="emit('timeout:init', $event)"
      @hide="sideTeamToTimeout = undefined"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameTimeoutSanctionActions',
}
</script>
