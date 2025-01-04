import { TeamSide } from '@/domain/team'
import { PricingPlan, PricingPlanTemporality } from '@/domain/pricing-plan'

export type EasyEventInfoRequestDialogShow = {
  email?: string
  pricingPlan?: PricingPlan
  temporality?: PricingPlanTemporality
  infoOnly?: boolean
}

export type EasyEvents = {
  'game-call-sidebar:open': TeamSide
  'game-call-sidebar:close': TeamSide
  'user-invite:loading': boolean
  'user-invite:submit': void
  'info-request:dialog:show': EasyEventInfoRequestDialogShow
  'info-request:dialog:hide': void
}
