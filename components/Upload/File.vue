<script setup lang="ts">
import { IconNames } from '@/domain/icon'
import { MAX_FILE_SIZE } from '@/domain/upload'
import { VALID_FILE_TYPES } from '@/domain/licensable'

const props = defineProps({
  fileName: {
    type: String,
    required: false,
  },
  accepted: {
    type: Array as PropType<string[]>,
    default: VALID_FILE_TYPES,
  },
})

const emit = defineEmits<{
  (e: 'file:changed', value: File | undefined): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const maxMB = ref<number>(MAX_FILE_SIZE)
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File>()

const inputFileName = computed(() => selectedFile.value?.name ?? props.fileName)

const fileChange = (e: InputEvent | Event) => {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) return

  let files = input.files

  if (files) {
    if (files.length === 0) return

    const file = files[0]

    if (file.size > maxMB.value * 1000000) {
      toast.error(t('errors.max_file_size', { mb: maxMB.value }))
      return
    }

    if (!props.accepted.includes(file.type)) {
      toast.error(
        t('errors.invalid_file_type', {
          formats: props.accepted
            .map(type => type.split('/')[1])
            .join(' • ')
            .trim(),
        }),
      )
      return
    }

    selectedFile.value = file
    emit('file:changed', selectedFile.value)
  }
}

const handleButtonClick = () => {
  !!selectedFile.value ? reset() : selectFile()
}

const selectFile = () => {
  fileInput.value?.click()
}

const reset = () => {
  if (selectedFile.value && fileInput.value) {
    selectedFile.value = undefined
    fileInput.value.value = ''
    emit('file:changed', undefined)
  }
}
</script>

<template>
  <section class="easy-upload-file-component">
    <FormInputGroup>
      <InputText v-if="inputFileName" v-model="inputFileName" readonly />
      <Button
        size="small"
        :severity="selectedFile ? 'danger' : 'primary'"
        @click.prevent="handleButtonClick"
      >
        <span v-if="selectedFile">
          <Icon :name="IconNames.delete" />
        </span>
        <span v-else>{{
          fileName ? t('forms.replace_file') : t('forms.select_file')
        }}</span>
      </Button>
    </FormInputGroup>
    <input
      ref="fileInput"
      type="file"
      :accept="props.accepted.join(', ')"
      @change="fileChange"
      hidden
    />
  </section>
</template>

<script lang="ts">
export default {
  name: 'UploadImage',
}
</script>
