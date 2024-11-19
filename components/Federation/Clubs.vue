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
  navigateTo(`/federation/${federation.id}/club/create`)
</script>

<template>
  <div class="easy-federation-clubs-component">
    <ClubList
      v-for="managedFederation in federation.federations"
      :clubs="managedFederation.clubs"
      :title="
        t('federations.federation_clubs', { name: managedFederation.name })
      "
      :loadingLabel="t('clubs.loading')"
      :noManagedText="t('federations.no_vinculated_clubs')"
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
