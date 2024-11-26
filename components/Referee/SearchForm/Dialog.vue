<script setup lang="ts">
import {
  ADD_USER_STEPS,
  AddUserStep,
  User,
  USER_FORM_FIELDS,
  UserSearchFormInputRef,
  UserStoreRequest,
} from '@/domain/user'
import {
  Federation,
  FederationRefereeAddRequest,
  FederationRefereeStoreRequest,
} from '@/domain/federation'
import { ROLE_TO_INVITED_TO_TYPE_MAPPER } from '@/domain/invite'
import { ROLE_MAPPER } from '@/domain/role'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  federation: {
    type: Object as PropType<Federation>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'referee:add', value: FederationRefereeAddRequest): void
  (e: 'referee:create', value: FederationRefereeStoreRequest): void
  (e: 'hide', value: boolean): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const selectedReferee = ref<User>()
const selectedRefereeAdmin = ref<boolean>(false)
const federationRefereeStoreRequest = ref<FederationRefereeStoreRequest>()
const userSearchFormInputRef = ref<UserSearchFormInputRef>()
const showDialog = ref<boolean>(!!props.visible)
const isLoading = ref<boolean>(props.loading)

const step = ref<AddUserStep>(ADD_USER_STEPS.search)

const userRoles = computed(() =>
  selectedRefereeAdmin.value
    ? [ROLE_MAPPER.referee_admin, ROLE_MAPPER.referee]
    : [ROLE_MAPPER.referee],
)

const submitLabel = computed(() => {
  switch (step.value) {
    case ADD_USER_STEPS.search:
      return t('referees.add')
    case ADD_USER_STEPS.invite:
      return t('referees.invite')
    case ADD_USER_STEPS.create:
      return t('referees.create')
  }
})

const submitDisabled = computed(() => isLoading.value)

const tabItems = computed(() => [
  {
    key: ADD_USER_STEPS.search,
    label: t('forms.search'),
  },
  {
    key: ADD_USER_STEPS.invite,
    label: t('forms.invite'),
  },
  {
    key: ADD_USER_STEPS.create,
    label: t('forms.create'),
  },
])

const handleRefereeSelected = (referee: User | undefined) => {
  selectedReferee.value = referee
}

const handleUserInvited = () => {
  step.value = ADD_USER_STEPS.search
  emit('hide', true)
}

const handleSubmitClick = () => {
  switch (step.value) {
    case ADD_USER_STEPS.search:
      handleAddReferee()
      break
    case ADD_USER_STEPS.invite:
      easyEmit('user-invite:submit')
      break
    case ADD_USER_STEPS.create:
      handleCreateReferee()
      break
  }
}

const handleAddReferee = () => {
  if (!selectedReferee.value) {
    toast.error(t('errors.referees.must_select_referee'))
    return
  }

  emit('referee:add', {
    federationId: props.federation.id,
    userId: selectedReferee.value.id,
    admin: selectedRefereeAdmin.value,
  })
}

const handleCreateReferee = () => {
  if (!federationRefereeStoreRequest.value) {
    toast.error(t('errors.fill_all_fields'))
    return
  }
  emit('referee:create', federationRefereeStoreRequest.value)
}

const handleTabChanged = (key: string) => {
  step.value = key as AddUserStep
}

const stopSearching = (cancel = false) => {
  if (cancel) handleRefereeSelected(undefined)

  if (
    userSearchFormInputRef.value?.editingUser &&
    !userSearchFormInputRef.value?.userChanged
  ) {
    userSearchFormInputRef.value?.stopEditing()
  }
}

const handleFormChanged = (request: UserStoreRequest) => {
  federationRefereeStoreRequest.value = {
    federationId: props.federation.id,
    admin: selectedRefereeAdmin.value,
    ...request,
  }
}

watch(
  () => props.visible,
  value => {
    showDialog.value = !!value
  },
)

onMounted(() => {
  easyListen('user-invite:loading', value => {
    isLoading.value = value
  })
})
</script>

<template>
  <DialogBottom
    class="easy-referee-search-form-dialog-component"
    :visible="showDialog"
    @hide="$emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ federation.name }}</Heading>
    </template>

    <EasyTabs class="mt-3" :items="tabItems" @tab:changed="handleTabChanged" />

    <div class="mt-5">
      <UserSearchFormInput
        v-if="step === ADD_USER_STEPS.search"
        ref="userSearchFormInputRef"
        :userOriginal="undefined"
        :userSelected="selectedReferee"
        :invitedToId="federation.id"
        :whereRole="ROLE_MAPPER.referee"
        :label="t('referees.search')"
        :showInvite="false"
        clearable
        @selected="handleRefereeSelected"
        @invited="stopSearching(true)"
        @cancel="stopSearching(true)"
      />

      <UserInviteForm
        v-else-if="step === ADD_USER_STEPS.invite"
        :invitedToType="ROLE_TO_INVITED_TO_TYPE_MAPPER[ROLE_MAPPER.federation]"
        :invitedToId="federation.id"
        :roles="userRoles"
        @invited="handleUserInvited"
      />

      <div v-else-if="step === ADD_USER_STEPS.create">
        <UserForm
          :roles="userRoles"
          :exclude="[
            USER_FORM_FIELDS.allowEmptyEmail,
            USER_FORM_FIELDS.birthDate,
            USER_FORM_FIELDS.gender,
          ]"
          assignRoles
          @form:change="handleFormChanged"
        />
      </div>
    </div>

    <div class="flex items-center cursor-pointer mt-5">
      <Checkbox v-model="selectedRefereeAdmin" inputId="refereeAdmin" binary />
      <label for="refereeAdmin" class="ml-2">
        {{ t('roles.type.referee_admin') }}
      </label>
    </div>

    <template #stickyFooter>
      <FormFooterActions
        :submitLabel="submitLabel"
        :disabled="submitDisabled"
        @form:submit="handleSubmitClick"
        @form:cancel="emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'RefereeSearchFormDialog',
}
</script>
