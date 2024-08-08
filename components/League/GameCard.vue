<script setup lang="ts">
import { Game, hasDefaultReferee } from '@/domain/game'
import { formatDateTime } from '@/domain/utils'
import { User } from '@/domain/user'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
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
})

const emit = defineEmits<{
  (e: 'referee:assign', value: Game): void
  (e: 'referee:assigned', value: User): void
}>()

const { t } = useI18n()

const menu = ref()
const menuItems = ref([
  {
    label: t('forms.options'),
    items: [
      {
        label: hasDefaultReferee(props.game)
          ? t('referees.assign')
          : t('referees.change'),
        icon: 'pi pi-plus',
        command: () => {
          emit('referee:assign', props.game)
        },
      },
    ],
  },
])

const toggleMenu = (event: Event) => menu.value.toggle(event)
</script>

<template>
  <div
    :class="['easy-league-game-card-component', { 'is-hoverable': hoverable }]"
  >
    <div>
      <p>{{ game.name }}</p>
      <small class="opacity-60">
        {{ formatDateTime(game.date) }}
      </small>
    </div>

    <div
      class="actions"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      @click="emit('referee:assign', props.game)"
    >
      <div
        v-if="!game.refereeId || hasDefaultReferee(game)"
        class="easy-badge-component"
      ></div>
      <EasyIcon class="gear" name="gear" size="1.5rem" />
      <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
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
