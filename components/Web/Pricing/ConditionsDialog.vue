<script setup lang="ts">
const props = defineProps({
  visible: {
    type: Boolean,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'hide'): void
}>()

const { t } = useI18n()

const showDialog = ref<boolean>(!!props.visible)

watch(
  () => props.visible,
  value => {
    showDialog.value = !!value
  },
)
</script>

<template>
  <DialogBottom
    class="easy-web-pricing-conditions-dialog-component"
    :visible="showDialog"
    :dismissable-mask="false"
    :closable="false"
    @hide="emit('hide')"
  >
    <template #header>
      <header class="be-support__header text-center w-full">
        <h3>{{ t('pricing_plan.conditions.title') }}</h3>
        <p>{{ t('pricing_plan.conditions.subtitle') }}</p>
      </header>
    </template>

    <div
      class="mt-5 mb-5 px-5"
      v-html="t('pricing_plan.card_more_info_list_html')"
    ></div>

    <footer class="text-center mt-10">
      <Button class="p-button mb-5 px-8" @click.prevent="emit('hide')">
        {{ t('forms.im_agree') }}
      </Button>
    </footer>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'WebPricingConditionsDialog',
}
</script>
