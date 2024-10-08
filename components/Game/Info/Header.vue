<script setup lang="ts">
import { Category, Game, Gender } from '@/domain/game'
import { formatDateByLocale } from '@/domain/utils'
import { Division } from '@/domain/division'
import { getListTagColor } from '@/domain/list'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
  division: {
    type: Object as PropType<Division>,
    required: false,
  },
  category: {
    type: Object as PropType<Category>,
    required: false,
  },
  gender: {
    type: Object as PropType<Gender>,
    required: false,
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
  center: {
    type: Boolean,
    default: false,
  },
})

const { t, locale } = useI18n()
</script>

<template>
  <header :class="[{ 'flex flex-col items-center text-center': center }]">
    <Heading class="easy-game-info-header-component" tag="h3">
      {{ game.name }}
    </Heading>
    <div class="flex items-center gap-2 mb-2">
      <template v-if="game.league">
        <Heading tag="h6">
          {{
            game.league?.category && game.league?.gender
              ? game.league?.name
              : game.league?.nameLong
          }}
        </Heading>
        <ListTag
          v-if="game.league.category"
          :label="`${t(`categories.${game.league.category.name}`)}`"
          color="primary"
        />
        <ListTag
          v-if="game.league.gender"
          :label="`${t(`genders.${game.league.gender.name}`)}`"
          :color="getListTagColor(game.league.gender.name)"
        />
      </template>
      <Heading v-if="division" tag="h6">
        {{ division.name }}
      </Heading>
      <ListTag
        v-if="category"
        :label="`${t(`categories.${category.name}`)}`"
        color="primary"
      />
      <ListTag
        v-if="gender"
        :label="`${t(`genders.${gender.name}`)}`"
        :color="getListTagColor(gender.name)"
      />
    </div>
    <p v-if="game.date">{{ formatDateByLocale(game.date, locale) }}</p>
    <GameStatus v-if="showStatus" class="mt-5" :status="game.status" />
  </header>
</template>

<script lang="ts">
export default {
  name: 'GameInfoHeaderComponent',
}
</script>
