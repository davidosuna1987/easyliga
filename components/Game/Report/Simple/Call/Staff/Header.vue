<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="col-span-12 p-2 border-solid border-t-0 text-center">
    <strong class="uppercase">{{ t('teams.staff') }}</strong>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleCallStaffHeader',
}
</script>
