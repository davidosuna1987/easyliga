<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { User } from '@/domain/user'
import { Game, getGameTeamName, hasDefaultReferee } from '@/domain/game'
import { TeamType } from '@/domain/team'
import { formatDateTime } from '@/domain/utils'
import { getFullName } from '@/domain/player'
import { LeagueShowGame } from '@/domain/league-show'

const props = defineProps({
  game: {
    type: Object as PropType<Game | LeagueShowGame>,
    required: true,
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
  showActions: {
    type: Boolean,
    default: false,
  },
  highlight: {
    type: Boolean,
    default: true,
  },
  isLeagueShowGame: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'game:set-partials', value: Game | LeagueShowGame): void
  (e: 'referee:assign', value: Game | LeagueShowGame): void
  (e: 'referee:assigned', value: User): void
}>()

const { t } = useI18n()
const auth = useAuthStore()

const EXCLAMATION = '!'
const menu = ref()

const commonMenuItems = [
  {
    label: t('forms.options'),
    items: [
      {
        label: hasDefaultReferee(props.game)
          ? t('referees.assign')
          : t('referees.change'),
        badge: hasDefaultReferee(props.game) ? EXCLAMATION : undefined,
        command: () => {
          emit('referee:assign', props.game)
        },
      },
      {
        label: t('reports.show'),
        command: () => {
          navigateTo(`/game/${props.game.id}/report`)
        },
      },
    ],
  },
]

const adminMenuItems = auth.isAdmin()
  ? [
      { separator: true },
      {
        label: t('forms.admin_options'),
        items: [
          {
            label: t('games.partials.assign'),
            command: () => {
              emit('game:set-partials', props.game)
            },
          },
        ],
      },
    ]
  : []

const menuItems = ref([...commonMenuItems, ...adminMenuItems])

const isOnlyOneMenuItemAvailable =
  !adminMenuItems.length && commonMenuItems.length === 1

const uniqueCommonMenuItem =
  isOnlyOneMenuItemAvailable && commonMenuItems[0].items?.length === 1
    ? commonMenuItems[0].items[0]
    : undefined

const toggleMenu = (event: Event) => {
  isOnlyOneMenuItemAvailable && uniqueCommonMenuItem
    ? uniqueCommonMenuItem.command()
    : menu.value.toggle(event)
}
</script>

<template>
  <div
    :data-game-id="game.id"
    :class="['easy-league-game-card-component', { 'is-hoverable': hoverable }]"
  >
    <div :class="['flex-1', { 'opacity-60': game.isBye }]">
      <div class="flex items-center">
        <div class="flex-1 mr-2">
          <p class="line-clamp-1">
            {{ getGameTeamName(game, TeamType.local) }}
          </p>
          <p class="line-clamp-1">
            {{
              game.isBye
                ? t('teams.rest')
                : getGameTeamName(game, TeamType.visitor)
            }}
          </p>
        </div>
        <span
          v-if="!game.isBye"
          class="font-bold tracking-tighter text-xl text-primary"
        >
          VS
        </span>
      </div>
      <template v-if="!game.isBye">
        <div class="flex items-end justify-between">
          <div class="grid">
            <small class="opacity-60 block">
              {{ formatDateTime(game.date) }}
            </small>

            <GameStatisticsLine
              v-if="game.status === 'finished' && game.statistics"
              :statistics="game.statistics"
              :highlight="highlight"
              hideResult
            />
            <template v-else>
              <p class="line-clamp-1">
                <small v-if="game.referee" class="opacity-60 block">
                  {{
                    `${t('referees.referee')}: ${getFullName(
                      game.referee.profile,
                    )}`
                  }}
                </small>
              </p>
            </template>
          </div>
          <GameStatisticsResult
            v-if="game.status === 'finished' && game.statistics"
            :statistics="game.statistics"
            :highlight="highlight"
            size="1.1rem"
          />
        </div>
      </template>
    </div>

    <div
      v-if="showActions && !game.isBye"
      class="actions"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      @click="toggleMenu"
    >
      <div
        v-if="!game.refereeId || hasDefaultReferee(game)"
        class="easy-badge-component"
      ></div>
      <EasyIcon class="gear" name="gear" size="1.5rem" />
      <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true">
        <template #item="{ item }">
          <div
            :class="[
              {
                'py-3 px-5 cursor-pointer flex items-center justify-between':
                  item.command,
              },
            ]"
          >
            <span v-if="item.icon" :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
            <span
              v-if="item.shortcut"
              class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
              >{{ item.shortcut }}</span
            >
            <div
              v-if="item.badge"
              class="bg-[var(--text-danger)] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full"
            >
              {{ item.badge }}
            </div>
          </div>
        </template>
      </Menu>
    </div>
  </div>
</template>

<style scoped lang="scss">
.easy-league-game-card-component {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: solid 1px var(--input-border-color);
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;

  .actions {
    position: absolute;
    left: 100%;
    bottom: 100%;
    translate: -75% 75%;
    cursor: pointer;

    .easy-badge-component {
      position: absolute;
      top: 0;
      left: 100%;
      min-width: 0.5rem;
      min-height: 0.5rem;
      border-radius: 9999px;
      color: white;
      padding: 2px;
      font-size: 0.75rem;
      background: var(--text-danger);
      translate: -50% -50%;
    }

    &:hover {
      .gear {
        color: var(--highlight-color);
      }
    }
  }

  &.is-hoverable {
    cursor: pointer;

    &:hover {
      background-color: var(--primary-color-medium);
      border-color: var(--primary-color);
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'LeagueGameCard',
}
</script>
