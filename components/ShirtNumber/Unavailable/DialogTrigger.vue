<script setup lang="ts">
const props = defineProps({
  unavailableShirtNumbers: {
    type: Array as PropType<number[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'hide', value: void): void
}>()

const { t } = useI18n()

const showDialog = ref<boolean>(false)
</script>

<template>
  <div
    class="easy-shirt-number-unavailable-dialog-trigger-component flex justify-end"
  >
    <a class="cursor-pointer" @click="showDialog = true">
      {{ t('shirts.show_unavailable') }}
    </a>

    <DialogBottom
      :visible="showDialog"
      :hasStickyFooter="false"
      @hide="showDialog = false"
    >
      <template #header>
        <Heading tag="h6">{{ t('shirts.unavailable') }}</Heading>
      </template>

      <div class="flex gap-3 justify-center flex-wrap mt-5">
        <IconShirtNumber
          v-for="shirtNumber of unavailableShirtNumbers"
          :shirtNumber="shirtNumber"
          size="lg"
          isIcon
          rounded
        />
      </div>
    </DialogBottom>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ShirtNumberUnavailableDialogTrigger',
}
</script>
