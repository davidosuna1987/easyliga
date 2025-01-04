import { PricingPlan } from '@/domain/pricing-plan'

export default class StripeService {
  pricingPlanFetch() {
    return useApi<PricingPlan[]>(`pricing-plan/fetch/raw`)
  }
}
