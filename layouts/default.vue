<template>
  <div class="default-layout">
    <NavbarApp />

    <main class="easy-main">
      <section class="easy-container" :class="$route.meta.containerClass">
        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
