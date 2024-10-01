<script setup lang="ts">
import { ShirtColor, SHIRT_COLORS } from '@/domain/team'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  teamName: {
    type: String,
    required: true,
  },
  shirtColor: {
    type: String as PropType<ShirtColor>,
    required: false,
  },
})

const emit = defineEmits(['hide', 'selected'])

const { t } = useI18n()

const showDialog = ref<boolean>(props.visible)
const form = ref<{ shirtColor?: ShirtColor }>({
  shirtColor: props.shirtColor,
})

watch(
  () => props.visible,
  value => (showDialog.value = value),
)

watch(
  () => props.shirtColor,
  value => (form.value.shirtColor = value),
)
</script>

<template>
  <DialogBottom
    class="easy-team-shirt-color-dialog-component"
    :visible="!!showDialog"
    :hasStickyFooter="false"
    @hide="emit('hide')"
  >
    <template #header>
      <Heading tag="h6">{{ t('teams.color', { teamName: teamName }) }}</Heading>
    </template>

    <div class="flex flex-wrap justify-center gap-5 mt-6">
      <TeamShirtColorItem
        v-for="color in SHIRT_COLORS"
        :key="color"
        :color="color"
        :bullet="50"
        class="cursor-pointer hover:opacity-75"
        @click="$emit('selected', color)"
      />
    </div>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'TeamShirtColorDialog',
}
</script>
