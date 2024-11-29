<script setup lang="ts">
import { League } from '@/domain/league'
import { LeagueShow } from '@/domain/league-show'

const props = defineProps({
  visible: {
    type: Boolean,
    required: false,
  },
  league: {
    type: Object as PropType<League | LeagueShow>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'matchdays:generated', value: boolean): void
  (e: 'loading', value: boolean): void
  (e: 'hide', value: boolean): void
}>()

const { t } = useI18n()

const showDialog = ref<boolean>(!!props.visible)
const leagueMatchdaysFormRef = ref<HTMLFormElement>()
const loading = ref<boolean>(false)

const handleFormSubmit = () => {
  leagueMatchdaysFormRef.value?.handleSubmit()
}

const handleLoading = (loadingApi: boolean) => {
  loading.value = loadingApi
}

watch(
  () => props.visible,
  value => {
    showDialog.value = !!value
  },
)
</script>

<template>
  <DialogBottom
    class="easy-league-matchdays-dialog-form-component"
    :visible="showDialog"
    :dismissable-mask="!loading"
    :closable="!loading"
    @hide="emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ t(`games.matchdays.generate`) }}</Heading>
    </template>

    <LeagueMatchdaysForm
      ref="leagueMatchdaysFormRef"
      class="mt-6"
      :league="league"
      @loading="handleLoading"
      @matchdays:generated="emit('matchdays:generated', $event)"
    />

    <template #stickyFooter>
      <FormFooterActions
        :disabled="loading"
        @form:submit="handleFormSubmit"
        @form:cancel="emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'LeagueMatchdaysDialogForm',
}
</script>
