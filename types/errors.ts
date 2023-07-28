export type ApiErrorList = string[]
export type ApiErrorObject = Record<string, ApiErrorList>
export type ApiErrors = ApiErrorList | ApiErrorObject

export type AlertError = {
  show: boolean
  list: ApiErrors
}
