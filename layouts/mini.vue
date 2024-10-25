<template>
  <div class="mini-layout" :class="$route.meta.layoutClass">
    <NuxtLoadingIndicator />
    <NavbarApp />

    <main class="easy-main" :class="$route.meta.mainClass">
      <section class="easy-container" :class="$route.meta.containerClass">
        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
