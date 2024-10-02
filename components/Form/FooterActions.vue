<script setup lang="ts">
import { Breakpoint } from '@/domain/breakpoints'
import { ButtonProps } from 'primevue/button'

const props = defineProps({
  submitLabel: {
    type: String,
    required: false,
  },
  cancelLabel: {
    type: String,
    required: false,
  },
  submitSeverity: {
    type: String as PropType<ButtonProps['severity']>,
    required: false,
  },
  cancelSeverity: {
    type: String as PropType<ButtonProps['severity']>,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hideSubmit: {
    type: Boolean,
    default: false,
  },
  hideCancel: {
    type: Boolean,
    default: false,
  },
  submitClass: {
    type: Array as PropType<string[]>,
    required: false,
  },
  size: {
    type: String as PropType<ButtonProps['size']>,
    required: false,
  },
  full: {
    type: Boolean,
    default: false,
  },
  fullWidthContainer: {
    type: Boolean,
    default: true,
  },
  sticky: {
    type: Boolean,
    default: false,
  },
  stickyBreakpoint: {
    type: String as PropType<Breakpoint>,
    required: false,
  },
  stickyCenter: {
    type: Boolean,
    default: false,
  },
  isStickyAction: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'form:submit', value: boolean): void
  (e: 'form:cancel', value: boolean): void
}>()

const { t } = useI18n()

const submitLabelText = computed(() => props.submitLabel ?? t('forms.store'))
const cancelLabelText = computed(() => props.cancelLabel ?? t('forms.cancel'))
</script>

<template>
  <footer
    :class="[
      'easy-form-footer-actions-component flex justify-end gap-3 mt-3',
      {
        'is-sticky': !!props.sticky || !!props.stickyBreakpoint,
        [`is-sticky__${props.stickyBreakpoint}`]: !!props.stickyBreakpoint,
        'is-sticky-action': !!props.isStickyAction,
        'w-full': props.fullWidthContainer,
      },
    ]"
    :style="{ '--sticky-position': props.stickyCenter ? 'center' : 'flex-end' }"
  >
    <Button
      v-if="!hideCancel"
      :class="{ grayscale: !cancelSeverity, 'flex-1': props.full }"
      :label="cancelLabelText"
      :severity="cancelSeverity"
      :size="size"
      :disabled="disabled"
      :loading="loading"
      :outlined="!cancelSeverity"
      @click="emit('form:cancel', true)"
    />
    <Button
      v-if="!hideSubmit"
      :class="[submitClass?.join(' '), { 'flex-1': props.full }]"
      :label="submitLabelText"
      :severity="submitSeverity"
      :size="size"
      :disabled="disabled"
      :loading="loading"
      @click="emit('form:submit', true)"
    />
  </footer>
</template>

<style scoped lang="scss">
@import '@/assets/css/common/breakpoints.scss';

.is-sticky {
  position: sticky;
  bottom: 0;
  background-color: var(--background-color);
  // margin-top: 1.5rem;
  // padding: 3rem 1.5rem 1.5rem;
  margin-top: 1rem;
  padding: 1.5rem 0;
  z-index: 10;
  display: flex;
  justify-content: var(--sticky-position);
  // margin-inline: calc(0px - var(--easy-main-padding) - var(--app-margin));
  // background: linear-gradient(
  //   to bottom,
  //   rgba(var(--background-color-rgb), 0) 0%,
  //   rgba(var(--background-color-rgb), 0.75) 25%,
  //   rgba(var(--background-color-rgb), 1) 100%
  // );
  background: linear-gradient(
    to bottom,
    rgba(var(--background-color-rgb), 0) 0%,
    rgba(var(--background-color-rgb), 0.8) 65%,
    rgba(var(--background-color-rgb), 1) 100%
  );
  backdrop-filter: blur(1px);

  @media (min-width: $media-lg) {
    justify-content: flex-end;
  }

  &.is-sticky__xs {
    justify-content: var(--sticky-position);
    @media (min-width: $media-xs) {
      margin-inline: 0;
      padding-inline: 0;
      justify-content: flex-end;
    }
  }

  &.is-sticky__sm {
    justify-content: var(--sticky-position);
    @media (min-width: $media-sm) {
      margin-inline: 0;
      padding-inline: 0;
      justify-content: flex-end;
    }
  }
  &.is-sticky__md {
    justify-content: var(--sticky-position);
    @media (min-width: $media-md) {
      margin-inline: 0;
      padding-inline: 0;
      justify-content: flex-end;
    }
  }
  &.is-sticky__ml {
    justify-content: var(--sticky-position);
    @media (min-width: $media-ml) {
      margin-inline: 0;
      padding-inline: 0;
      justify-content: flex-end;
    }
  }
  &.is-sticky__lg {
    justify-content: var(--sticky-position);
    @media (min-width: $media-lg) {
      margin-inline: 0;
      padding-inline: 0;
      justify-content: flex-end;
    }
  }
  &.is-sticky__xl {
    justify-content: var(--sticky-position);
    @media (min-width: $media-xl) {
      margin-inline: 0;
      padding-inline: 0;
      justify-content: flex-end;
    }
  }
  &.is-sticky__2xl {
    justify-content: var(--sticky-position);
    @media (min-width: $media-2xl) {
      margin-inline: 0;
      padding-inline: 0;
      justify-content: flex-end;
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'FormFooterActions',
}
</script>
