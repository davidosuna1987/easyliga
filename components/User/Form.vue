<script setup lang="ts">
import {
  USER_DEFAULT_ROLE,
  USER_FORM_FIELDS,
  UserFormField,
  UserStoreRequest,
} from '@/domain/user'
import { PROFILE_GENDER_TYPES } from '@/domain/profile'
import { ApiErrorObject } from '@/types/errors'
import { Role, ROLES } from '@/domain/role'

const props = defineProps({
  assignRoles: {
    type: Boolean,
    default: false,
  },
  roles: {
    type: Array as PropType<Role[]>,
    default: [USER_DEFAULT_ROLE],
  },
  exclude: {
    type: Array as PropType<UserFormField[]>,
    default: [],
  },
})

const emit = defineEmits<{
  (e: 'form:change', value: UserStoreRequest): void
}>()

const { t } = useI18n()

const isExcludedField = (field: UserFormField) => props.exclude.includes(field)

const form = ref<UserStoreRequest>({
  allowEmptyEmail: isExcludedField('allowEmptyEmail') ? false : true,
  email: '',
  firstName: '',
  lastName: '',
  birthDate: undefined,
  gender: undefined,
  roles: [...new Set([...props.roles, USER_DEFAULT_ROLE])],
})

const errors = ref<ApiErrorObject>()
const loadingApi = ref<Boolean>(false)

const selectableRoles = computed(() => (props.roles ? props.roles : ROLES))
const selectedRoles = computed(() => form.value.roles ?? [])

const genderLabel = (gender: string) => t(`forms.${gender}`)

const toggleRole = (role: Role) => {
  if (props.roles.length || !props.assignRoles) return
  if (role === USER_DEFAULT_ROLE && form.value.roles?.includes(role)) return

  if (form.value.roles?.includes(role)) {
    form.value.roles = form.value.roles?.filter(r => r !== role)
  } else {
    form.value.roles?.push(role)
  }
}

watch(
  () => props.roles,
  () => {
    form.value.roles = [...new Set([...props.roles, USER_DEFAULT_ROLE])]
  },
  { deep: true },
)

watch(
  () => form.value,
  () => {
    emit('form:change', form.value)
  },
  { deep: true },
)
</script>

<template>
  <form class="easy-user-form-component">
    <EasyGrid class="profile-form-grid" :gap="3">
      <div
        v-if="!isExcludedField(USER_FORM_FIELDS.allowEmptyEmail)"
        class="flex items-center cursor-pointer"
      >
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
        v-if="!isExcludedField(USER_FORM_FIELDS.birthDate)"
        :label="t('forms.birth_date')"
        :error="errors?.birthDate?.[0]"
        required
      >
        <Calendar v-model="form.birthDate" class="w-full" :touchUI="true" />
      </FormLabel>
      <FormLabel
        v-if="!isExcludedField(USER_FORM_FIELDS.gender)"
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
        v-if="
          props.assignRoles &&
          selectableRoles.length &&
          !isExcludedField(USER_FORM_FIELDS.roles)
        "
        class="gap-2"
        :label="t('roles.role', 2)"
        :error="errors?.roles?.[0]"
        inline
        required
      >
        <Tag
          v-for="role in selectableRoles"
          :class="[
            'border border-solid border-[var(--primary-color)]',
            assignRoles ? 'cursor-pointer' : 'pointer-events-none',
            selectedRoles.includes(role)
              ? undefined
              : 'text-[var(--primary-color)] bg-transparent',
          ]"
          :key="role"
          :value="t(`roles.type.${role}`)"
          @click.prevent="toggleRole(role)"
        />
      </FormLabel>
    </EasyGrid>
  </form>
</template>

<script lang="ts">
export default {
  name: 'UserForm',
}
</script>
