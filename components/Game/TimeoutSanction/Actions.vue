<script setup lang="ts">
import { Team, TeamMember, TeamSide, TeamSideEnum } from '@/domain/team'
import { Set } from '@/domain/set'
import { GameStatus } from '@/domain/game'
import { MAX_TIMEOUTS_PER_SET, Timeout } from '@/domain/timeout'
import { Sanction } from '@/domain/sanction'

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
  gameSanctions: {
    type: Array as PropType<Sanction[]>,
    required: false,
  },
  gameStatus: {
    type: String as PropType<GameStatus>,
    required: true,
  },
})

const emit = defineEmits(['timeout:init', 'sanction:stored', 'sidebar:toggle'])

const app = useNuxtApp()
const toast = useEasyToast()

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

const setSideTeamToTimeout = (side: TeamSide) => {
  if (props[`${side}SideTeamTimeouts`]?.length >= MAX_TIMEOUTS_PER_SET) {
    toast.error(
      app.$i18n.t('errors.max_timeouts', { max: MAX_TIMEOUTS_PER_SET }),
    )
    return
  }
  sideTeamToTimeout.value = side
}
</script>

<template>
  <div class="game-timeout-sanction-actions-component flex justify-between">
    <div class="flex gap-3">
      <template v-if="gameStatus === 'finished'">
        <Button
          class="team-toggle-button p-3 relative"
          rounded
          @click="emit('sidebar:toggle', TeamSideEnum.left)"
        >
          <Icon name="pepicons-pencil:pen" size="1.5rem" />
        </Button>
      </template>
      <template v-else>
        <Button
          class="team-toggle-button p-3 relative"
          rounded
          @click="emit('sidebar:toggle', TeamSideEnum.left)"
        >
          <Icon name="ph:users-three-fill" size="1.5rem" />
        </Button>
        <Button
          class="p-3 relative"
          rounded
          @click="setSideTeamToTimeout(TeamSideEnum.left)"
        >
          <Icon name="material-symbols:alarm" size="1.5rem" />
          <Badge
            v-if="props.leftSideTeamTimeouts?.length >= 0"
            class="text-xs absolute top-[-2px] right-[-2px] p-[4px]"
            :value="props.leftSideTeamTimeouts?.length"
            rounded
          />
        </Button>
        <Button
          class="p-3"
          rounded
          @click="sideTeamToSanction = TeamSideEnum.left"
        >
          <Icon name="mdi:cards" size="1.5rem" />
        </Button>
      </template>
    </div>

    <div class="flex gap-3">
      <template v-if="gameStatus === 'finished'">
        <Button
          class="team-toggle-button p-3 relative"
          rounded
          @click="emit('sidebar:toggle', TeamSideEnum.right)"
        >
          <Icon name="pepicons-pencil:pen" size="1.5rem" />
        </Button>
      </template>
      <template v-else>
        <Button
          class="p-3"
          rounded
          @click="sideTeamToSanction = TeamSideEnum.right"
        >
          <Icon name="mdi:cards" size="1.5rem" />
        </Button>
        <Button
          class="p-3 relative"
          rounded
          @click="setSideTeamToTimeout(TeamSideEnum.right)"
        >
          <Icon name="material-symbols:alarm" size="1.5rem" />
          <Badge
            v-if="props.rightSideTeamTimeouts?.length >= 0"
            class="text-xs absolute top-[-2px] right-[-2px] p-[4px]"
            :value="props.rightSideTeamTimeouts?.length"
            rounded
          />
        </Button>
        <Button
          class="team-toggle-button p-3 relative"
          rounded
          @click="emit('sidebar:toggle', TeamSideEnum.right)"
        >
          <Icon name="ph:users-three-fill" size="1.5rem" />
        </Button>
      </template>
    </div>

    <SanctionDialog
      v-if="teamToSanction"
      :visible="!!teamToSanction"
      :team="teamToSanction"
      :members="teamMembersToSanction"
      :currentSet="currentSet"
      :gameSanctions="props.gameSanctions"
      @sanction:stored="emit('sanction:stored', $event)"
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

<style scoped lang="scss">
.game-timeout-sanction-actions-component {
  width: 100%;
  max-width: var(--court-max-width);
  margin: 0 auto;
  .p-button {
    overflow: visible;

    .p-badge {
      width: 17px;
      height: 17px;
      display: grid;
      place-content: center;
      border: solid 2px;
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'GameTimeoutSanctionActions',
}
</script>
