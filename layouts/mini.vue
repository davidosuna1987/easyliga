<template>
  <div :class="['easy-layout mini-layout', $route.meta.layoutClass]">
    <NavbarApp />

    <EasyLayoutMain>
      <div :class="['easy-container', $route.meta.containerClass]">
        <slot />
      </div>
    </EasyLayoutMain>

    <Footer />
  </div>
</template>
