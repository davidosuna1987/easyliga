<script setup lang="ts">
import { Sede } from '@/domain/sede'
import { IconNames } from '@/domain/icon'

const props = defineProps({
  sedes: {
    type: Array as PropType<Sede[]>,
    required: true,
  },
  clubId: {
    type: Number,
    required: false,
  },
  label: {
    type: String,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'sede:selected', value: Sede): void
}>()

const { t } = useI18n()

const selectedSede = ref<Sede>()
const sedes = ref<Sede[]>(props.sedes)
const showSedeDialogForm = ref<boolean>(false)

const handleSedeAdded = (sede: Sede) => {
  sedes.value = [...sedes.value, sede]
  selectedSede.value = sede
  showSedeDialogForm.value = false
  emit('sede:selected', sede)
}
</script>

<template>
  <div class="easy-sedes-selector-component">
    <FormLabel v-if="label" :label="label" />
    <FormInputGroup>
      <Dropdown
        v-model="selectedSede"
        :loading="props.loading"
        :options="sedes"
        optionLabel="name"
        scrollHeight="210px"
        :placeholder="t('sedes.select')"
        @update:modelValue="emit('sede:selected', $event)"
      />
      <Button
        v-if="!!clubId"
        class="add-sede-button py-0"
        outlined
        @click.prevent.stop="showSedeDialogForm = true"
      >
        <Icon :name="IconNames.add" size="2rem" />
      </Button>
    </FormInputGroup>

    <SedeDialogForm
      v-if="!!clubId"
      :visible="!!showSedeDialogForm"
      :clubId="clubId"
      @hide="showSedeDialogForm = false"
      @refresh="handleSedeAdded"
    />
  </div>
</template>

<style scoped lang="scss">
.add-sede-button {
  filter: grayscale(1);

  &:hover {
    filter: grayscale(0);
  }
}
</style>

<script lang="ts">
export default {
  name: 'SedeSelector',
}
</script>
