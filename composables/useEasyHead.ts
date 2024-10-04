import { useRuntimeConfig, useHead } from '#imports'
import type {
  MergeHead,
  UseHeadInput,
  HeadEntryOptions,
  ActiveHeadEntry,
} from '@unhead/vue'

export function useEasyHead<T extends MergeHead>(
  translationKey?: string,
  input?: UseHeadInput<T>,
  options?: HeadEntryOptions,
): ActiveHeadEntry<UseHeadInput<T>> | void {
  const config = useRuntimeConfig()

  const pageTitle = translationKey
    ? `${config.public.appName} | ${useNuxtApp().$i18n.t(translationKey)}`
    : config.public.appName

  return useHead(
    {
      title: pageTitle,
      ...input,
    },
    options,
  )
}
