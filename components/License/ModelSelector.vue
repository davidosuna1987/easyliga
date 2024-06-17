<script setup lang="ts">
import {
  LicensableModelMapped,
  LicensableModelsMapped,
  LicensableType,
  mapLicensableTypeToLicensableModelType,
  mapApiManagedModelMappedToLicensableModelMapped,
  mapApiManagedModelsMappedToLicensableModelsMapped,
  mapMappedToLicensableModelsMappedToGroupedByTypeLicensableModelsMapped,
  LicensableModel,
} from '@/domain/licensable'
import { useAuthStore } from '@/stores/useAuthStore'
import { getFullName } from '@/domain/player'
import { Profile } from '@/domain/profile'

const props = defineProps({
  type: {
    type: String as PropType<LicensableType | 'all'>,
    required: true,
  },
  licensable: {
    type: Object as PropType<LicensableModel>,
    required: false,
  },
  readonly: {
    type: Boolean,
    default: false,
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

const isReadonly = computed(
  () => !!props.readonly || selectableModel.value?.length === 1,
)

const setSelectableModels = async () => {
  if (props.licensable && props.type !== 'all') {
    const licensableModelType = mapLicensableTypeToLicensableModelType(
      props.type,
    )
    const licensableModelName =
      licensableModelType === 'profile'
        ? getFullName(props.licensable as Profile)
        : 'name' in props.licensable
        ? props.licensable.name
        : undefined

    if (licensableModelName) {
      selectableModel.value = [
        {
          id: props.licensable.id,
          name: licensableModelName,
          type: licensableModelType,
        },
      ]
      selectedModel.value = selectableModel.value[0]
      emit('model:selected', selectedModel.value)
      return
    }
  }

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
    :panelClass="!!isReadonly ? 'hidden pointer-events-none' : ''"
    v-model="selectedModel"
    :options="selectableModel"
    :optionLabel="model => model.name"
    scrollHeight="210px"
    :placeholder="$t(`licenses.model.select.${type}`)"
    :loading="loadingApi"
    @update:modelValue="$emit('model:selected', $event)"
  >
    <template v-if="!!isReadonly" #dropdownicon>&nbsp;</template>
  </Dropdown>
  <Dropdown
    v-else-if="selectableModels"
    class="easy-license-model-selector-component"
    :panelClass="!!isReadonly ? 'hidden pointer-events-none' : ''"
    v-model="selectedModel"
    :options="selectableModelsGroup"
    optionLabel="name"
    optionGroupChildren="items"
    :optionGroupLabel="model => $t(`licenses.type.${model.items[0].type}`)"
    scrollHeight="210px"
    :placeholder="$t(`licenses.model.select.${type}`)"
    :loading="loadingApi"
    @update:modelValue="$emit('model:selected', $event)"
  >
    <template v-if="!!isReadonly" #dropdownicon>&nbsp;</template>
  </Dropdown>
</template>

<script lang="ts">
export default {
  name: 'LicenseModelSelector',
}
</script>
