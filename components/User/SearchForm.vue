<script lang="ts" setup>
import UserService from '@/services/user'
import { User, mapApiUserToUser } from '@/domain/user'
import { AutoCompleteItemSelectEvent } from 'primevue/autocomplete'

const props = defineProps({
  full: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'selected', value: User): void
}>()

const userService = new UserService()
const toast = useEasyToast()

const search = ref<string>('')
const selectedUser = ref<User>()
const matchUsers = ref<User[]>()
const loadingApi = ref<boolean>(false)

const searchUsers = async () => {
  if (search.value.length < 3) return
  loadingApi.value = true
  const { data, error } = await userService.search({
    search: search.value,
    with: 'profile',
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
</script>

<template>
  <form class="easy-user-search-form-component">
    <template v-if="!!selectedUser?.profile">
      <FormLabel :label="$t('forms.you_selected')" />
      <ProfileItem
        :profile="selectedUser.profile"
        :selectable="false"
        remove-icon="times"
        :removeUser="handleRemoveUser"
      />
    </template>
    <template v-else>
      <FormLabel :label="$t('users.search')" />
      <AutoComplete
        v-model="search"
        :class="{ 'w-full': props.full }"
        :input-class="{ 'w-full': props.full }"
        :suggestions="matchUsers"
        @complete="searchUsers"
        @item-select="handleUserSelected"
      >
        <template #option="slotProps">
          <ProfileItem
            class="pointer-events-none"
            :profile="slotProps.option.profile"
          />
        </template>
      </AutoComplete>
    </template>
  </form>
</template>

<script lang="ts">
export default {
  name: 'UserSearchForm',
}
</script>
