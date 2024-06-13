<script setup lang="ts">
import {
  LicensableModelMapped,
  LicensableModelsMapped,
  LicensableType,
  mapLicensableTypeToLicensableModelType,
  mapApiManagedModelMappedToLicensableModelMapped,
  mapApiManagedModelsMappedToLicensableModelsMapped,
  mapMappedToLicensableModelsMappedToGroupedByTypeLicensableModelsMapped,
} from '@/domain/licensable'
import { useAuthStore } from '@/stores/useAuthStore'

const props = defineProps({
  type: {
    type: String as PropType<LicensableType | 'all'>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'model:selected', value: LicensableModelMapped): void
}>()

const { managedModelMapped, managedModelsMapped } = useAuthStore()

const selectedModel = ref<LicensableModelMapped>()
const selectableModel = ref<LicensableModelMapped[]>()
const selectableModels = ref<LicensableModelsMapped>()
const loadingApi = ref<boolean>(false)

const setSelectableModels = async () => {
  loadingApi.value = true
  if (props.type === 'all') {
    const { data } = await managedModelsMapped()

    if (data.value?.data.managed) {
      selectableModels.value =
        mapApiManagedModelsMappedToLicensableModelsMapped(
          data.value.data.managed,
        )
    }
  } else {
    const { data } = await managedModelMapped(
      mapLicensableTypeToLicensableModelType(props.type),
    )

    if (data.value?.data.managed) {
      selectableModel.value = data.value?.data.managed.map(
        mapApiManagedModelMappedToLicensableModelMapped,
      )

      if (selectableModel.value.length === 1) {
        selectedModel.value = selectableModel.value[0]
        emit('model:selected', selectedModel.value)
      }
    }
  }
  loadingApi.value = false
}

const selectableModelsGroup = computed(() => {
  return selectableModels.value
    ? mapMappedToLicensableModelsMappedToGroupedByTypeLicensableModelsMapped(
        selectableModels.value,
      )
    : undefined
})

watch(() => props.type, setSelectableModels, { immediate: true })
</script>

<template>
  <Dropdown
    v-if="loadingApi || selectableModel"
    class="easy-license-model-selector-component"
    v-model="selectedModel"
    :options="selectableModel"
    :optionLabel="model => model.name"
    scrollHeight="210px"
    :placeholder="$t(`licenses.model.select.${type}`)"
    :loading="loadingApi"
    @update:modelValue="$emit('model:selected', $event)"
  />
  <Dropdown
    v-else-if="selectableModels"
    class="easy-license-model-selector-component"
    v-model="selectedModel"
    :options="selectableModelsGroup"
    optionLabel="name"
    optionGroupChildren="items"
    :optionGroupLabel="model => $t(`licenses.type.${model.items[0].type}`)"
    scrollHeight="210px"
    :placeholder="$t(`licenses.model.select.${type}`)"
    :loading="loadingApi"
    @update:modelValue="$emit('model:selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'LicenseModelSelector',
}
</script>
