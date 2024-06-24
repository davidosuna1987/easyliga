<script setup lang="ts">
import { Sede } from '@/domain/sede'

const props = defineProps({
  sedes: {
    type: Array as PropType<Sede[]>,
    default: [],
  },
  clubId: {
    type: Number,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'refresh', value: boolean): void
}>()

const { t } = useI18n()

const showSedeDialogForm = ref<boolean>(false)
const formSede = ref<Sede>()
const readonly = ref<boolean>(false)

const handleSedeShow = (sede: Sede) => {
  readonly.value = true
  formSede.value = sede
  showSedeDialogForm.value = true
}

const handleSedeCreate = () => {
  readonly.value = false
  formSede.value = undefined
  showSedeDialogForm.value = true
}

const handleSedeEdit = (sede: Sede) => {
  readonly.value = false
  formSede.value = sede
  showSedeDialogForm.value = true
}

const handleSedeDeleted = () => {
  emit('refresh', true)
}

const handleSedeDialogFormHide = () => {
  readonly.value = false
  formSede.value = undefined
  showSedeDialogForm.value = false
}
</script>

<template>
  <div class="easy-sede-list-component">
    <header class="header flex justify-between items-center mb-5">
      <Heading tag="h6" position="center">
        {{ t('sedes.sede', 2) }}
      </Heading>
      <Button
        class="action"
        :label="t('sedes.add')"
        size="small"
        @click.prevent="handleSedeCreate"
      />
    </header>

    <EasyGrid :gap="3">
      <template v-if="!!sedes.length" v-for="sede in sedes" :key="sede.id">
        <SedeListItem
          :sede="sede"
          @sede:show="handleSedeShow"
          @sede:edit="handleSedeEdit(sede)"
          @sede:deleted="handleSedeDeleted()"
        />
      </template>
      <template v-else>
        {{ t(`sedes.no_sedes`) }}
      </template>
    </EasyGrid>

    <SedeDialogForm
      :visible="!!showSedeDialogForm"
      :sede="formSede"
      :clubId="clubId"
      :readonly="readonly"
      @hide="handleSedeDialogFormHide"
      @refresh="emit('refresh', true)"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SedeList',
}
</script>
