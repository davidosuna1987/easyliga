<script setup lang="ts">
import { SaveSignatureReturnType, VueSignaturePad } from 'vue-signature-pad'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  saveInline: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'signature:created', value: string): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const signaturePad = ref<VueSignaturePad>()
const showPlaceholder = ref<boolean>(true)
const buttonsDisabled = ref<boolean>(props.disabled)

const handleOnBegin = () => {
  showPlaceholder.value = false
}

const undo = () => {
  signaturePad.value?.undoSignature()
  if (signaturePad.value?.isEmpty()) showPlaceholder.value = true
}

const clearSignature = () => {
  showPlaceholder.value = true
  signaturePad.value?.clearSignature()
}

const saveSignature = (
  type: string = 'image/svg+xml',
): SaveSignatureReturnType | undefined => {
  if (!signaturePad.value) return
  const { data } = signaturePad.value.saveSignature(type)

  if (data) {
    buttonsDisabled.value = true
    signaturePad.value.lockSignaturePad()
    emit('signature:created', data)
  } else {
    toast.error(t('reports.signature_empty'))
  }
}

watch(
  () => props.disabled,
  value => (buttonsDisabled.value = value),
)

defineExpose({
  saveSignature,
  clearSignature,
})
</script>

<template>
  <div class="easy-signature-component">
    <div class="signature-wrapper">
      <VueSignaturePad
        width="100%"
        height="100%"
        ref="signaturePad"
        :options="{
          maxWidth: 1.5,
          onBegin: () => handleOnBegin(),
        }"
        :style="{
          position: 'relative',
          zIndex: 1,
        }"
      />

      <div v-if="showPlaceholder" class="signature-placeholder">
        <span>{{ $t('reports.sign_here') }}</span>
      </div>
    </div>

    <footer class="flex gap-x-0.5">
      <Button
        :class="['signature-button', { grayscale: buttonsDisabled }]"
        outlined
        :disabled="buttonsDisabled"
        @click="undo"
      >
        {{ $t('forms.undo') }}
      </Button>
      <Button
        :class="['signature-button', { grayscale: buttonsDisabled }]"
        outlined
        :disabled="buttonsDisabled"
        @click="clearSignature"
      >
        {{ $t('forms.clear') }}
      </Button>
      <Button
        v-if="props.saveInline"
        :class="['signature-button', { grayscale: buttonsDisabled }]"
        outlined
        :disabled="buttonsDisabled"
        @click="saveSignature()"
      >
        {{ $t('forms.save') }}
      </Button>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.easy-signature-component {
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: var(--box-shadow-hard);

  .signature-wrapper {
    position: relative;
    aspect-ratio: 16/9;
    background-color: var(--signature-background);

    .signature-placeholder {
      position: absolute;
      inset: 0;
      display: grid;
      place-content: center;
      font-size: 3rem;
      font-weight: 100;
      color: gainsboro;
      pointer-events: none;
    }
  }

  .signature-button {
    display: flex;
    justify-content: center;
    flex: 1;
    border-radius: 0;
    border: none !important;
    background-color: var(--signature-button-background);
    color: var(--signature-button-color);

    &:focus {
      box-shadow: none;
    }

    &:hover {
      color: var(--signature-button-color);
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'Signature',
}
</script>
