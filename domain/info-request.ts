import {
  ApiInfoRequest,
  ApiInfoRequestStoreRequest,
  ApiInfoRequestUpdateRequest,
} from 'types/api/info-request'
import { PricingPlanTemporality } from './pricing-plan'

export const INFO_REQUEST_MESSAGE_MAX_WIDTH = 1000

export const DEFAULT_INFO_REQUEST_FORM: InfoRequestStoreRequest = {
  email: '',
  name: undefined,
  phone: undefined,
  pricingPlan: undefined,
  temporality: undefined,
  message: undefined,
  infoOnly: true,
}

export const INFO_REQUEST_STATUS_MAP = {
  new: 'new',
  read: 'read',
  replied: 'replied',
} as const

export const INFO_REQUEST_STATUS_COLOR_MAP = {
  new: 'primary-color',
  read: 'warning-color',
  replied: 'hero-purple',
} as const

export type InfoRequestStatus = keyof typeof INFO_REQUEST_STATUS_MAP

export type InfoRequestDialogType = 'status' | 'reply' | 'invite'

export type InfoRequest = {
  id: number
  email: string
  name?: string
  phone?: string
  pricingPlan?: string
  temporality?: PricingPlanTemporality
  message?: string
  status: InfoRequestStatus
  infoOnly: boolean
  createdAt?: string
}

export type InfoRequestStoreRequest = {
  email: string
  name?: string
  phone?: string
  pricingPlan?: string
  temporality?: PricingPlanTemporality
  message?: string
  infoOnly: boolean
}

export type InfoRequestUpdateRequest = InfoRequestStoreRequest & {
  status: InfoRequestStatus
}

export type InfoRequestFormRef = {
  handleSubmit: () => void
  loadingApi: boolean
  form: InfoRequestStoreRequest
}

export const mapApiInfoRequestToInfoRequest = (
  apiInfoRequest: ApiInfoRequest,
) => ({
  id: apiInfoRequest.id,
  name: apiInfoRequest.name ?? undefined,
  email: apiInfoRequest.email,
  phone: apiInfoRequest.phone ?? undefined,
  pricingPlan: apiInfoRequest.pricing_plan ?? undefined,
  temporality: apiInfoRequest.temporality ?? undefined,
  message: apiInfoRequest.message ?? undefined,
  status: apiInfoRequest.status,
  infoOnly: apiInfoRequest.info_only,
  createdAt: apiInfoRequest.created_at ?? undefined,
})

export const mapInfoRequestStoreRequestToApiInfoRequestStoreRequest = (
  infoRequest: InfoRequestStoreRequest,
): ApiInfoRequestStoreRequest => ({
  email: infoRequest.email,
  name: infoRequest.name ?? null,
  phone: infoRequest.phone ?? null,
  pricing_plan: infoRequest.pricingPlan ?? null,
  temporality: infoRequest.temporality ?? null,
  message: infoRequest.message ?? null,
  info_only: infoRequest.infoOnly,
})

export const mapInfoRequestUpdateRequestToApiInfoRequestUpdateRequest = (
  infoRequest: InfoRequestUpdateRequest,
): ApiInfoRequestUpdateRequest => ({
  email: infoRequest.email,
  name: infoRequest.name ?? null,
  phone: infoRequest.phone ?? null,
  pricing_plan: infoRequest.pricingPlan ?? null,
  temporality: infoRequest.temporality ?? null,
  message: infoRequest.message ?? null,
  info_only: infoRequest.infoOnly,
  status: infoRequest.status,
})
