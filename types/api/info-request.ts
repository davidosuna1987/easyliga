import { InfoRequestStatus } from '@/domain/info-request'
import { PricingPlanTemporality } from 'domain/pricing-plan'

export type ApiInfoRequest = {
  id: number
  email: string
  name: string | null
  phone: string | null
  pricing_plan: string | null
  temporality: PricingPlanTemporality | null
  message: string | null
  status: InfoRequestStatus
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export type ApiInfoRequestStoreRequest = {
  email: string
  name: string | null
  phone: string | null
  pricing_plan: string | null
  temporality: PricingPlanTemporality | null
  message: string | null
  info_only: boolean
}

export type ApiInfoRequestUpdateRequest = ApiInfoRequestStoreRequest & {
  status: InfoRequestStatus
}

export type ApiInfoRequestResponse = {
  success: true
  data: {
    info_request: ApiInfoRequest
  }
  errors: null
}

export type ApiInfoRequestsResponse = {
  success: true
  data: {
    info_requests: ApiInfoRequest[]
  }
  errors: null
}
