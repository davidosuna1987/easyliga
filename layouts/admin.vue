<script setup lang="ts">
const toggleClass = ref<string>('closed')
</script>

<template>
  <div
    :class="[
      `easy-layout admin-layout sidebar-left-layout sidebar-${toggleClass}`,
      $route.meta.layoutClass,
    ]"
  >
    <NavbarApp />

    <EasyLayoutMain>
      <aside class="easy-sidebar easy-sidebar-left">
        <a
          role="button"
          tabindex="0"
          class="easy-sidebar-toggle open"
          @click.prevent="toggleClass = 'opened'"
        >
          <Icon name="ic:round-keyboard-double-arrow-right" />
        </a>
        <a
          role="button"
          tabindex="0"
          class="easy-sidebar-toggle close"
          @click.prevent="toggleClass = 'closed'"
        >
          <Icon name="ic:outline-close" />
        </a>
        <AdminSidebar />
      </aside>

      <div :class="['easy-container', $route.meta.containerClass]">
        <slot />
      </div>
    </EasyLayoutMain>

    <Footer />
  </div>
</template>
