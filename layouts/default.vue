<template>
  <div class="default-layout">
    <NavbarApp />

    <main class="easy-main">
      <section class="easy-container">
        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
