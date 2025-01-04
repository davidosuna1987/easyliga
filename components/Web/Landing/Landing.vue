<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { EasyEventInfoRequestDialogShow } from '@/domain/event'
import { PricingPlan, PricingPlanTemporality } from '@/domain/pricing-plan'

const auth = useAuthStore()

const showInfoRequestFormDialog = ref<boolean>(false)
const showInfoRequestFormDialogEmail = ref<string | undefined>(auth.user?.email)
const showInfoRequestFormDialogPricingPlan = ref<PricingPlan>()
const showInfoRequestFormDialogTemporality = ref<PricingPlanTemporality>()
const showInfoRequestFormDialogInfoOnly = ref<boolean>()

onMounted(() => {
  easyListen(
    'info-request:dialog:show',
    (data: EasyEventInfoRequestDialogShow) => {
      showInfoRequestFormDialog.value = true
      showInfoRequestFormDialogPricingPlan.value = data.pricingPlan
      showInfoRequestFormDialogTemporality.value = data.temporality
      showInfoRequestFormDialogInfoOnly.value = data.infoOnly

      if (!auth.user?.email) {
        showInfoRequestFormDialogEmail.value = data.email
      }
    },
  )
})
</script>

<template>
  <div class="easy-web-landing-component">
    <WebLandingSectionDetails />
    <WebLandingSectionFeatures />

    <section class="landing-pricing mt-20">
      <WebPricingPlans />
    </section>

    <section class="landing-ready full-section bg-[#1f2937] -mb-8 md:-mb-16">
      <WebLandingSectionReady />
    </section>

    <InfoRequestStoreFormDialog
      :visible="showInfoRequestFormDialog"
      :email="showInfoRequestFormDialogEmail"
      :pricingPlan="showInfoRequestFormDialogPricingPlan"
      :temporality="showInfoRequestFormDialogTemporality"
      :infoOnly="showInfoRequestFormDialogInfoOnly"
      @hide="showInfoRequestFormDialog = false"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'WebLanding',
}
</script>
