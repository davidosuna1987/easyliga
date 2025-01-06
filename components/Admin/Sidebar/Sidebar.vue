<script setup lang="ts"></script>

<template>
  <nav class="easy-admin-sidebar-component flex flex-col gap-3 items-baseline">
    <AdminSidebarLink to="/admin"> Dashboard </AdminSidebarLink>
    <AdminSidebarLink class="link" to="/admin/info-request/list">
      Info requests
    </AdminSidebarLink>
  </nav>
</template>

<script lang="ts">
export default {
  name: 'AdminSidebar',
}
</script>
