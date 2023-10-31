<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['referee'],
  containerClass: 'referee-arbitrate',
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-referee-game-arbitrate-page">
      <RefereeGameArbitrate />
    </div>
  </NuxtLayout>
</template>

<script lang="ts">
export default {
  name: 'RefereeGamesArbitrateGamePage',
}
</script>
