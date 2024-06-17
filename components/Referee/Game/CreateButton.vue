<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="easy-referee-create-game-button-component">
    <Button
      class="create-game-button"
      :label="t('games.create')"
      size="large"
      @click.prevent="navigateTo('/referee/games/create')"
    >
      <NuxtImg
        class="create-game-button__logo"
        src="/logos/easyliga.svg"
        quality="100"
        width="25"
        height="25"
        fit="contain"
      />
      <span class="create-game-button__label">{{ t('games.create') }}</span>
    </Button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
