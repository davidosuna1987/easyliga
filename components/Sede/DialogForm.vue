<script setup lang="ts">
import { Sede, SedeFormRef } from '@/domain/sede'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  sede: {
    type: Object as PropType<Sede>,
    required: false,
  },
  clubId: {
    type: Number,
    required: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'hide', value: boolean): void
  (e: 'refresh', value: Sede): void
}>()

const { t } = useI18n()

const sedeFormRef = ref<SedeFormRef>()
const showDialog = ref<boolean>(props.visible)
const formLoading = ref<boolean>(false)

const handleFormSubmit = () => {
  sedeFormRef.value?.handleSubmit()
}

watch(
  () => props.visible,
  value => {
    showDialog.value = !!value
  },
)
</script>

<template>
  <DialogBottom
    class="easy-alert-dialog-component"
    :visible="!!showDialog"
    @hide="emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ sede?.name }}</Heading>
    </template>

    <SedeForm
      ref="sedeFormRef"
      class="mt-6"
      :sede="sede"
      :clubId="clubId"
      :readonly="readonly"
      reduced
      @success="emit('refresh', $event)"
      @loading="formLoading = $event"
      @cancel="emit('hide', true)"
    />

    <template #footer>
      <FormFooterActions
        v-if="!props.readonly"
        class="mt-10"
        :loading="formLoading"
        :submitLabel="props.sede ? t('sedes.update') : t('sedes.create')"
        @form:submit="handleFormSubmit"
        @form:cancel="emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'SedeDialogForm',
}
</script>
