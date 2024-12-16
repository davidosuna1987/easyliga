<template>
  <div :class="['default-layout', $route.meta.layoutClass]">
    <NuxtLoadingIndicator />
    <NavbarApp />

    <main :class="['easy-main', $route.meta.mainClass]">
      <slot name="hero" />
      <section
        :class="[
          'easy-container',
          $route.meta.containerClass,
          { 'is-reduced': $route.meta.reduced },
        ]"
        :style="{
          ...(!!$route.meta.heroSize && {
            marginTop: `${Number($route.meta.heroSize)}px`,
          }),
        }"
      >
        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
