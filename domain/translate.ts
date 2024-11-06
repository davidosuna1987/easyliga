import { ApiTranslateJsonRequest } from '@/types/api/translate'
import { LocaleCode } from '@/domain/locale'

export type TranslatedJSON = {
  [key: string]: string | TranslatedJSON
}

export type TranslatedLocale = {
  [locale: string]: TranslatedJSON
}

export type TranslateJsonRequest = {
  json: string
  inputLocale: LocaleCode
  outputLocales: LocaleCode[]
}

export const mapTranslateJsonRequestToApiTranslateJsonRequest = (
  request: TranslateJsonRequest,
): ApiTranslateJsonRequest => ({
  json: request.json,
  input_locale: request.inputLocale,
  output_locales: request.outputLocales,
})
