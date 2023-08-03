<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['referee'],
})
</script>

<template>
  <div class="easy-games-create-page">
    <Heading class="mb-5" position="center">{{ $t('games.create') }}</Heading>
    <GameForm />
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'GamesCreatePage',
}
</script>
