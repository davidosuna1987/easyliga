<template>
  <div :class="['easy-layout default-layout', $route.meta.layoutClass]">
    <NavbarApp />

    <EasyLayoutMain>
      <div v-if="$slots.hero" class="easy-hero relative z-10">
        <slot name="hero" />
      </div>

      <div
        :class="[
          'easy-container',
          $route.meta.containerClass,
          { 'is-reduced': $route.meta.reduced },
        ]"
        :style="{
          ...(!!$route.meta.heroSize && {
            paddingBlockStart: `calc(${Number($route.meta.heroSize)}px + 2rem)`,
          }),
        }"
      >
        <slot />
      </div>
    </EasyLayoutMain>

    <Footer />
  </div>
</template>
