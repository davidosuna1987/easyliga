<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'

definePageMeta({
  middleware: ['role'],
  roles: ['referee'],
})

const auth = useAuthStore()
</script>

<template>
  <div class="easy-referee-page">
    <Heading class="mb-5" position="center">
      {{
        auth.profile?.first_name
          ? $t('referees.welcome', { name: auth.profile.first_name })
          : $t('referees.welcome_no_name')
      }}
    </Heading>

    <div class="easy-referee-create-match-container">
      <Button
        class="create-game-button"
        :label="$t('games.create')"
        size="large"
        @click.prevent="navigateTo('/games/create')"
      >
        <NuxtImg
          class="create-game-button__logo"
          src="/logos/easyliga.svg"
          quality="100"
          width="25"
          height="25"
          fit="contain"
        />
        <span class="create-game-button__label">{{ $t('games.create') }}</span>
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereePage',
}
</script>
