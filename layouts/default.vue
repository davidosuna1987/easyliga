<template>
  <div class="default-layout" :class="$route.meta.layoutClass">
    <NavbarApp />

    <main class="easy-main" :class="$route.meta.mainClass">
      <section class="easy-container" :class="$route.meta.containerClass">
        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
