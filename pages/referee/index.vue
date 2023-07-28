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
    <h4 class="text-center mb-5">
      {{
        auth.profile?.first_name
          ? $t('referees.welcome', { name: auth.profile.first_name })
          : $t('referees.welcome_no_name')
      }}
    </h4>

    <div class="easy-referee-create-match-container">
      <Button
        class="create-game-button"
        :label="$t('games.create')"
        size="large"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.easy-referee-page {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
}
.create-game-button {
  width: 80%;
  max-width: 250px;
  margin-inline: auto;
  display: block;
  padding-block: 2rem;
  border-radius: 50%;
  aspect-ratio: 1/1;
  font-size: 30px;
}
.p-button-label {
  font-weight: 800 !important;
}
</style>

<script lang="ts">
export default {
  name: 'RefereePage',
}
</script>
