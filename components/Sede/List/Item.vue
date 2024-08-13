<script setup lang="ts">
import { Sede } from '@/domain/sede'
import { formatDate } from '@/domain/utils'
import { IconNames } from '@/domain/icon'
import SedeService from '@/services/sede'

const props = defineProps({
  sede: {
    type: Object as PropType<Sede>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'sede:show', value: Sede): void
  (e: 'sede:edit', value: Sede): void
  (e: 'sede:deleted', value: Sede): void
}>()

const { t } = useI18n()
const toast = useEasyToast()
const loadingApi = ref<boolean>(false)
const sedeService = new SedeService()
const showRemoveSedeDialog = ref<boolean>(false)

const handleRemoveSede = async () => {
  loadingApi.value = true
  const { data } = await sedeService.destroy(props.sede.id)
  loadingApi.value = false
  if (data.value) {
    toast.success(t('sedes.deleted'))
    emit('sede:deleted', props.sede)
  }
}
</script>

<template>
  <div
    class="easy-sede-list-item-component flex justify-between items-center gap-3 px-4 py-2 rounded-md shadow"
  >
    <div>{{ sede.name }}</div>

    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <FormActionIcon
          :icon="IconNames.show"
          type="primary"
          v-tooltip.top="{
            value: t('sedes.show'),
          }"
          @click.stop="emit('sede:show', sede)"
        />
        <FormActionIcon
          :icon="IconNames.edit"
          type="info-dark"
          v-tooltip.top="{
            value: t('sedes.edit'),
          }"
          @click.stop="emit('sede:edit', sede)"
        />
        <FormActionIcon
          :icon="IconNames.trash"
          type="danger"
          :outlined="false"
          v-tooltip.top="{
            value: t('sedes.delete'),
          }"
          @click.stop="showRemoveSedeDialog = true"
        />
      </div>
    </div>

    <AlertDialog
      :visible="!!showRemoveSedeDialog"
      :title="t('sedes.delete')"
      :message="t('sedes.delete_alert')"
      :acceptLabel="t('forms.delete')"
      severity="danger"
      :disabled="loadingApi"
      @accepted="handleRemoveSede"
      @hide="showRemoveSedeDialog = false"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SedeListItem',
}
</script>
