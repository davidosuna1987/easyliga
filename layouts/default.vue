<template>
  <div :class="['default-layout', $route.meta.layoutClass]">
    <NuxtLoadingIndicator />
    <NavbarApp />

    <main :class="['easy-main', $route.meta.mainClass]">
      <section
        :class="[
          'easy-container',
          $route.meta.containerClass,
          { 'is-reduced': $route.meta.reduced },
        ]"
      >
        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
