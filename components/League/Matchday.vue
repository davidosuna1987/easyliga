<script setup lang="ts">
import { Game } from '@/domain/game'
import { Matchday } from '@/domain/league'
import { LeagueShowGame, LeagueShowGameMatchday } from '@/domain/league-show'

const props = defineProps({
  matchday: {
    type: Object as PropType<Matchday | LeagueShowGameMatchday>,
    required: true,
  },
  header: {
    type: String,
    required: false,
  },
  showActions: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'game:set-partials', value: Game | LeagueShowGame): void
  (e: 'referee:assign', value: Game | LeagueShowGame): void
}>()

const { t } = useI18n()

const orderMatchdayGamesByBye = (games: Game[] | LeagueShowGame[]) => {
  return games.sort((a, b) => {
    if (a.isBye) return 1
    if (b.isBye) return -1
    return 0
  })
}
</script>

<template>
  <div v-if="matchday.matchday" class="easy-league-matchday-component">
    <Heading tag="h6" class="mb-2">
      {{ props.header ?? t('games.matchdays.num', { num: matchday.matchday }) }}
    </Heading>
    <EasyGrid :breakpoints="{ md: 2, lg: 3, xl: 4 }" :gap="3">
      <LeagueGameCard
        v-for="game in orderMatchdayGamesByBye(matchday.games)"
        :key="game.id"
        :game="game"
        :showActions="showActions"
        @referee:assign="emit('referee:assign', game)"
        @game:set-partials="emit('game:set-partials', game)"
      />
    </EasyGrid>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LeagueMatchday',
}
</script>
