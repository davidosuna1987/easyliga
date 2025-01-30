<script setup lang="ts"></script>

<template>
  <blockquote class="easy-blockquote-component">
    <span>
      <slot />
    </span>
  </blockquote>
</template>

<style scoped lang="scss">
blockquote {
  width: 100%;
  font-style: italic;
  color: var(--text-color);
  padding: 0.5rem 1.5rem;
  border-left: 2px solid var(--primary-color);
  line-height: 1.6;
  position: relative;
}

blockquote::before {
  font-family: Arial;
  content: '\201C';
  color: var(--primary-color);
  font-size: 2.5rem;
  position: absolute;
  left: 5px;
  top: -10px;
}

blockquote::after {
  content: '';
}

blockquote span {
  display: block;
  color: var(--text-color);
  margin-top: 0.5rem;
}
</style>

<script lang="ts">
export default {
  name: 'EasyBlockquote',
}
</script>
