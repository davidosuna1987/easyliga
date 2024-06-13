<script setup lang="ts">
import {
  GameSignatureStoreRequest,
  GameSignatureType,
} from '@/domain/game-signature'
import { TeamType } from '@/domain/team'
import { VueSignaturePad } from 'vue-signature-pad'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: undefined,
  },
  saveInline: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String as PropType<GameSignatureType>,
    required: true,
  },
  teamType: {
    type: String as PropType<TeamType>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'hide'): void
  (e: 'signature:created', value: GameSignatureStoreRequest): void
}>()

const { t } = useI18n()

const signaturePad = ref<VueSignaturePad>()
const showDialog = ref<boolean>(props.visible)

const hide = () => {
  emit('hide')
}

const handleSignatureCreated = (signature: string) => {
  emit('signature:created', {
    type: props.type,
    signature,
    teamType: props.teamType,
  })
}

watch(
  () => props.visible,
  value => (showDialog.value = value),
)
</script>

<template>
  <DialogBottom :visible="!!showDialog" @hide="hide">
    <template #header>
      <Heading tag="h6">
        {{
          props.title
            ? props.title
            : t(`reports.signature_type.short.${props.type}`)
        }}
      </Heading>
    </template>

    <Signature
      ref="signaturePad"
      class="mt-6"
      :save-inline="props.saveInline"
      :disabled="props.loading"
      @signature:created="handleSignatureCreated"
    />

    <template #footer>
      <FormFooterActions
        :disabled="props.loading"
        :submitLabel="t('reports.sign')"
        @form:submit="signaturePad?.saveSignature()"
        @form:cancel="hide"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'SignatureDialog',
}
</script>
