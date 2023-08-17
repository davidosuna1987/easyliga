<script setup lang="ts"></script>

<template>
  <div class="easy-game-court-component">
    <div class="side left">
      <div class="position-1 serving">
        <IconEasyLiga />
        <span class="shirt-number">1</span>
      </div>
      <div class="position-2">
        <span class="shirt-number">2</span>
      </div>
      <div class="position-3">
        <IconCaptain size="sm" />
        <IconLibero size="sm" />
        <span class="shirt-number">3</span>
      </div>
      <div class="position-4">
        <span class="shirt-number">4</span>
      </div>
      <div class="position-5">
        <span class="shirt-number">5</span>
      </div>
      <div class="position-6">
        <span class="shirt-number">6</span>
      </div>
    </div>
    <div class="side right">
      <div class="position-1">
        <span class="shirt-number">9</span>
      </div>
      <div class="position-2">
        <span class="shirt-number">8</span>
      </div>
      <div class="position-3">
        <IconLibero size="sm" />
        <span class="shirt-number">7</span>
      </div>
      <div class="position-4">
        <span class="shirt-number">6</span>
      </div>
      <div class="position-5">
        <IconCaptain size="sm" />
        <span class="shirt-number">5</span>
      </div>
      <div class="position-6">
        <span class="shirt-number">4</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCourt',
}
</script>
