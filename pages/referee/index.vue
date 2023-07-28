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
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereePage',
}
</script>
