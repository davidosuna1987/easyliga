<script setup lang="ts">
import { Federation } from '@/domain/federation'

const props = defineProps({
  federation: {
    type: Object as PropType<Federation>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'refresh', value: boolean): void
}>()

const { t } = useI18n()

const goToCreateClub = (federation: Federation) =>
  navigateTo(`/federations/${federation.id}/club/create`)
</script>

<template>
  <div class="easy-federation-clubs-component">
    <!-- <ClubList
      :clubs="federation.clubs"
      :title="t('federations.federation_clubs', { name: federation.name })"
      :loadingLabel="t('clubs.loading')"
      :noManagedText="t('federations.no_vinculated_clubs')"
      :hoverable="false"
      @club:create="goToCreateClub(federation)"
      @refresh="emit('refresh', true)"
    /> -->

    <ClubList
      v-for="managedFederation in federation.federations"
      class="mt-10"
      :clubs="managedFederation.clubs"
      :title="
        t('federations.federation_clubs', { name: managedFederation.name })
      "
      :loadingLabel="t('clubs.loading')"
      :noManagedText="t('federations.no_vinculated_clubs')"
      :hoverable="false"
      @club:create="goToCreateClub(managedFederation)"
      @refresh="emit('refresh', true)"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'FederationClubs',
}
</script>
