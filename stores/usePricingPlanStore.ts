import { defineStore } from 'pinia'
import { PricingPlan } from '@/domain/pricing-plan'
import StripeService from '@/services/stripe'

const stripeService = new StripeService()

export const usePricingPlanStore = defineStore('pricingPlans', () => {
  const pricingPlans = ref<PricingPlan[]>([])

  const fetchPricingPlans = async () => {
    const response = await stripeService.pricingPlanFetch()

    pricingPlans.value = response.data.value ?? []

    return response
  }

  return {
    pricingPlans,
    fetchPricingPlans,
  }
})
