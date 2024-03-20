<script setup lang="ts">
import { SaveSignatureReturnType, VueSignaturePad } from 'vue-signature-pad'

const props = defineProps({
  saveInline: {
    type: Boolean,
    default: true,
  },
})

const toast = useEasyToast()
const { $i18n } = useNuxtApp()
const emit = defineEmits(['signature:created'])

const signaturePad = ref<VueSignaturePad>()
const showPlaceholder = ref<boolean>(true)
const disabled = ref<boolean>(false)

const handleOnBegin = () => {
  console.log('handleOnBegin')
  showPlaceholder.value = false
}

const undo = () => {
  signaturePad.value?.undoSignature()
  if (signaturePad.value?.isEmpty()) showPlaceholder.value = true
}

const clear = () => {
  showPlaceholder.value = true
  signaturePad.value?.clearSignature()
}

const saveSignature = (
  type: string = 'image/svg+xml',
): SaveSignatureReturnType | undefined => {
  if (!signaturePad.value) return
  const { isEmpty, data } = signaturePad.value.saveSignature(type)

  if (isEmpty) {
    toast.error($i18n.t('reports.signature_empty'))
  } else {
    disabled.value = true
    signaturePad.value.lockSignaturePad()
    emit('signature:created', data)
  }
}

defineExpose({
  saveSignature,
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
        :class="['signature-button', { grayscale: disabled }]"
        outlined
        :disabled="disabled"
        @click="undo"
      >
        {{ $t('forms.undo') }}
      </Button>
      <Button
        :class="['signature-button', { grayscale: disabled }]"
        outlined
        :disabled="disabled"
        @click="clear"
      >
        {{ $t('forms.clear') }}
      </Button>
      <Button
        v-if="props.saveInline"
        :class="['signature-button', { grayscale: disabled }]"
        outlined
        :disabled="disabled"
        @click="() => saveSignature"
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
    aspect-ratio: 16/9;

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
    background-color: var(--primary-color-lightest);

    &:focus {
      box-shadow: none;
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'Signature',
}
</script>
