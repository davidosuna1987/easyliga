import { TranslatedLocale } from '@/domain/translate'
import { LocaleCode } from '@/domain/locale'

export type ApiTranslateJsonRequest = {
  json: string
  input_locale: LocaleCode
  output_locales: LocaleCode[]
}

export type ApiTranslateResponse = {
  success: true
  data: {
    translated_locales: TranslatedLocale
  }
  errors: null
}
