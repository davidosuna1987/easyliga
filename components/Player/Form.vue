<script setup lang="ts">
import { PlayerStoreRequest } from '@/domain/player'
import { PROFILE_GENDER_TYPES } from '@/domain/profile'
import { ApiErrorObject } from '@/types/errors'

const props = defineProps({
  unavailableShirtNumbers: {
    type: Array as PropType<number[]>,
    default: [],
  },
})

const emit = defineEmits<{
  (e: 'form:change', value: PlayerStoreRequest): void
}>()

const { t } = useI18n()

const form = ref<PlayerStoreRequest>({
  allowEmptyEmail: true,
  email: '',
  firstName: '',
  lastName: '',
  birthDate: undefined,
  gender: undefined,
  shirtNumber: 0,
  captain: false,
  libero: false,
})

const errors = ref<ApiErrorObject>()
const loadingApi = ref<Boolean>(false)

const showUnavailableShirtNumbersDialog = ref<boolean>(false)

const genderLabel = (gender: string) => t(`forms.${gender}`)

watch(
  () => form.value,
  () => {
    emit('form:change', form.value)
  },
  { deep: true },
)
</script>

<template>
  <form class="easy-player-form-component">
    <EasyGrid class="profile-form-grid" :gap="3">
      <div class="flex items-center cursor-pointer">
        <Checkbox
          v-model="form.allowEmptyEmail"
          inputId="allowEmptyEmail"
          binary
        />
        <label for="allowEmptyEmail" class="ml-2">
          {{ t('forms.generate_easyliga_email') }}
        </label>
      </div>
      <FormLabel
        :label="t('forms.email')"
        :error="errors?.email?.[0]"
        :required="!form.allowEmptyEmail"
      >
        <InputText
          v-if="form.allowEmptyEmail"
          class="w-full"
          :value="t('forms.auto_generated')"
          disabled
        />
        <InputText v-else v-model="form.email" class="w-full" type="email" />
      </FormLabel>
      <FormLabel
        :label="t('forms.name')"
        :error="errors?.firstName?.[0]"
        required
      >
        <InputText v-model="form.firstName" class="w-full" type="text" />
      </FormLabel>
      <FormLabel
        :label="t('forms.surnames')"
        :error="errors?.lastName?.[0]"
        required
      >
        <InputText v-model="form.lastName" class="w-full" type="text" />
      </FormLabel>
      <FormLabel
        :label="t('forms.birth_date')"
        :error="errors?.birthDate?.[0]"
        required
      >
        <Calendar v-model="form.birthDate" class="w-full" :touchUI="true" />
      </FormLabel>
      <FormLabel
        :label="t('forms.gender')"
        :error="errors?.gender?.[0]"
        required
      >
        <Dropdown
          v-model="form.gender"
          class="w-full"
          :options="[
            PROFILE_GENDER_TYPES.male,
            PROFILE_GENDER_TYPES.female,
            PROFILE_GENDER_TYPES.other,
          ]"
          :optionLabel="genderLabel"
          :disabled="!!loadingApi"
        />
      </FormLabel>
      <FormLabel
        :label="t('shirts.number_select')"
        :error="errors?.shirt_number?.[0]"
        required
      >
        <InputNumber
          v-model="form.shirtNumber"
          showButtons
          buttonLayout="horizontal"
          :min="1"
          :max="999"
        />
      </FormLabel>
    </EasyGrid>

    <ShirtNumberUnavailableDialogTrigger
      class="mt-3"
      :unavailableShirtNumbers="unavailableShirtNumbers"
    />
  </form>
</template>

<script lang="ts">
export default {
  name: 'PlayerForm',
}
</script>
