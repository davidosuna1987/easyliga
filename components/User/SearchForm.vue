<script lang="ts" setup>
import UserService from '@/services/user'
import { User, mapApiUserToUser } from '@/domain/user'
import { AutoCompleteItemSelectEvent } from 'primevue/autocomplete'
import { Role } from '@/domain/role'

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: false,
  },
  whereRole: {
    type: String as PropType<Role>,
    default: '',
  },
  with: {
    type: Array as PropType<string[]>,
    default: [],
  },
  invite: {
    type: Boolean,
    default: false,
  },
  full: {
    type: Boolean,
    default: false,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  handleBlur: {
    type: Function as PropType<() => void>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'selected', value: User): void
  (e: 'invited', value: boolean): void
}>()

const { t } = useI18n()
const toast = useEasyToast()
const userService = new UserService()

const search = ref<string>('')
const selectedUser = ref<User | undefined>(props.user)
const matchUsers = ref<User[]>()
const loadingApi = ref<boolean>(false)

const withPelations = computed((): string =>
  props.with.includes('profile')
    ? props.with.join(',')
    : [...props.with].concat('profile').join(','),
)

const searchAvailable = computed((): boolean => search.value.length >= 3)

const showUserInviteDialog = ref<boolean>()

const searchUsers = async () => {
  if (!searchAvailable) return
  loadingApi.value = true
  const { data, error } = await userService.search({
    search: search.value,
    with: withPelations.value,
    ...(props.whereRole && { where_has: `roles:name:${props.whereRole}` }),
  })
  loadingApi.value = false

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    matchUsers.value = data.value.data.users.map(mapApiUserToUser)
  }
}

const handleRemoveUser = () => {
  selectedUser.value = undefined
  search.value = ''
}

const handleUserSelected = (event: AutoCompleteItemSelectEvent) => {
  selectedUser.value = event.value
  if (!selectedUser.value) return
  emit('selected', selectedUser.value)
}

const handleUserInvited = () => {
  showUserInviteDialog.value = false
  emit('invited', true)
}
</script>

<template>
  <form class="easy-user-search-form-component">
    <template v-if="!!selectedUser?.profile">
      <FormLabel v-if="showLabel" :label="t('forms.you_selected')" />
      <ProfileItem
        :profile="selectedUser.profile"
        :selectable="false"
        remove-icon="times"
        :removeUser="handleRemoveUser"
      />
    </template>
    <template v-else>
      <FormLabel v-if="showLabel" :label="t('users.search')" />
      <AutoComplete
        v-model="search"
        :class="{ 'w-full': props.full }"
        :input-class="{ 'w-full': props.full }"
        :suggestions="matchUsers"
        :auto-option-focus="false"
        :complete-on-focus="searchAvailable"
        @blur="handleBlur"
        @complete="searchUsers"
        @item-select="handleUserSelected"
      >
        <template #option="slotProps">
          <ProfileItem
            class="pointer-events-none"
            :profile="slotProps.option.profile"
          />
        </template>

        <template #empty>
          <div v-if="invite" class="py-4 px-7 text-center">
            <p>{{ t('users.not_found') }}</p>
            <div class="m-3 flex flex-col gap-3 items-center">
              <p>{{ t('users.invite_long') }}</p>
              <Button
                :label="t('forms.invite')"
                @click="showUserInviteDialog = true"
              />
            </div>
          </div>
        </template>
      </AutoComplete>
    </template>

    <UserInviteDialog
      v-if="showUserInviteDialog"
      :visible="!!showUserInviteDialog"
      :roles="[props.whereRole]"
      @hide="showUserInviteDialog = undefined"
      @invited="handleUserInvited"
    />
  </form>
</template>

<style scoped lang="scss">
.p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item {
  padding: 0;
}
</style>

<script lang="ts">
export default {
  name: 'UserSearchForm',
}
</script>
