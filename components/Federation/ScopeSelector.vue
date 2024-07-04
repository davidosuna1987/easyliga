<script setup lang="ts">
import { FEDERATION_SCOPE_MAPPER, FederationScope } from '@/domain/federation'

const props = defineProps({
  scope: {
    type: String as PropType<FederationScope>,
    required: false,
  },
  full: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'scope:selected', value: FederationScope): void
}>()

const { t } = useI18n()

const selectedScope = ref<FederationScope | undefined>(props.scope)
</script>

<template>
  <div class="">
    <Dropdown
      v-model="selectedScope"
      :class="[
        'easy-federation-scope-selector-component',
        { 'w-full': props.full },
      ]"
      :options="[...Object.values(FEDERATION_SCOPE_MAPPER)]"
      :optionLabel="option => t(`federations.scope.${option}`)"
      :placeholder="t('federations.scope.select')"
      @update:modelValue="emit('scope:selected', $event)"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'FederationScopeSelector',
}
</script>
