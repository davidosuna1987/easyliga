<script setup>
const { t } = useI18n()
const emit = defineEmits()

const props = defineProps({
  preview: {
    type: String,
    required: true,
  },
})

const maxMB = ref(5)
const imageFileInput = ref(null)

const image = ref({
  preview: props.preview,
  file: null,
  name: null,
  size: null,
})

const avatarStyle = computed(() => ({
  backgroundImage: `url(${image.value.preview})`,
}))

const imageItemClick = () => {
  image.value.file ? resetImage() : selectImage()
}

const selectImage = () => {
  imageFileInput.value.click()
}

const imageChange = e => {
  let files = e.target.files || e.originalEvent.dataTransfer.files

  if (files) {
    if (files.length === 0) return
    image.value.file = files[0]
    let size = files[0].size

    if (size > maxMB.value * 1000000) {
      alert(t('errors.max_file_size', { mb: maxMB.value }))
      return
    }

    let fileName = files[0].name
    let fileSize =
      size > 1000000
        ? Math.round((size / 1000000) * 10) / 10 + ' MB'
        : Math.round((size / 1000) * 10) / 10 + ' KB'

    image.value.name = fileName
    image.value.size = fileSize

    let img
    img = new Image()
    img.onload = function () {}

    let _URL = window.URL || window.webkitURL
    let imageURL = _URL.createObjectURL(files[0])
    image.value.preview = imageURL
  }
}

const resetImage = () => {
  imageFileInput.value.value = null
  image.value.preview = props.preview
  image.value.file = null
  image.value.name = null
  image.value.size = null
}

watch(image.value, () => emit('image', image.value))
</script>

<template>
  <section class="easy-upload-image-component">
    <a
      class="wrapper relative w-[6rem] h-[6rem] rounded-full border-solid border-2 text-primary cursor-pointer"
    >
      <div
        v-tooltip.top="
          image.file ? t('forms.remove_image') : t('forms.change_image')
        "
        :style="avatarStyle"
        class="preview w-full h-full rounded-full inline-block bg-img"
        :class="{ 'hover-danger': image.file }"
        @click.prevent="imageItemClick"
      ></div>
      <div
        class="button absolute bottom-0 right-0 border-solid border-2 rounded-full w-[2rem] h-[2rem] flex justify-center items-center cursor-pointer text-white"
        :class="[image.file ? 'bg-danger' : 'bg-primary']"
        @click.prevent="imageItemClick"
      >
        <Icon :name="image.file ? 'ic:baseline-delete' : 'ic:baseline-edit'" />
      </div>
      <input
        ref="imageFileInput"
        class="upload-file-input"
        type="file"
        name="image"
        @change="imageChange"
        style="display: none"
      />
    </a>
  </section>
</template>
