<script setup lang="ts">
import { VueSignaturePad } from 'vue-signature-pad'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  saveInline: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['hide', 'signature:created'])

const signaturePad = ref<VueSignaturePad>()
const showDialog = ref<boolean>(props.visible)

const hide = () => {
  emit('hide')
}

const saveSignature = () => {
  signaturePad.value?.saveSignature()
}

defineExpose({
  signaturePad,
})

watch(
  () => props.visible,
  value => (showDialog.value = value),
)
</script>

<template>
  <DialogBottom :visible="!!showDialog" @hide="hide">
    <template #header>
      <Heading tag="h6">{{ $t('reports.sign') }}</Heading>
    </template>

    <p class="mt-3">
      {{ $t('reports.sign_description') }}
    </p>

    <Signature
      ref="signaturePad"
      class="mt-6"
      :save-inline="props.saveInline"
      @signature:created="emit('signature:created', $event)"
    />

    <template #footer>
      <div class="flex justify-end gap-3 mt-3">
        <Button
          class="grayscale"
          :label="$t('forms.cancel')"
          severity="info"
          outlined
          @click="hide"
        />
        <Button :label="$t('reports.sign')" @click="saveSignature" />
      </div>
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'SignatureDialog',
}
</script>
