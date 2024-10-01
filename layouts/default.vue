<template>
  <div :class="['default-layout', $route.meta.layoutClass]">
    <NavbarApp />

    <main :class="['easy-main', $route.meta.mainClass]">
      <section :class="['easy-container', $route.meta.containerClass]">
        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
