<script setup lang="ts">
import { User, UserSearchFormRef } from '@/domain/user'
import { InvitedRole } from '@/domain/invite'
import { GridBreakpoints, mapBreakpointsToClasses } from '@/domain/grid'
import { IconNames } from '@/domain/icon'

const props = defineProps({
  userOriginal: {
    type: Object as PropType<User>,
    required: false,
  },
  userSelected: {
    type: Object as PropType<User>,
    required: false,
  },
  invitedToId: {
    type: Number,
    required: false,
  },
  whereRole: {
    type: String as PropType<InvitedRole>,
    required: true,
  },
  showInvite: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String,
    required: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  reduced: {
    type: Boolean,
    default: false,
  },
  breakpoints: {
    type: Object as PropType<GridBreakpoints>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'selected', value: User): void
  (e: 'invited', value: boolean): void
  (e: 'cancel', value: boolean): void
}>()

const { t } = useI18n()

const getUserOriginal = (): User | undefined =>
  props.whereRole === 'referee' && props.userOriginal?.id === 1
    ? undefined
    : props.userOriginal

const userSearchFormRef = ref<UserSearchFormRef>()
const editingUser = ref<boolean>(false)
const selectedUser = ref<User | undefined>(getUserOriginal())

const mappedBreakpoints = computed(() =>
  props.breakpoints ? mapBreakpointsToClasses(props.breakpoints) : undefined,
)

const showSelectedUserProfile = computed(
  () =>
    !!props.editable &&
    (!!props.readonly || (selectedUser.value?.profile && !editingUser.value)),
)

const showEditButton = computed(
  () => !!props.editable && !props.readonly && !!selectedUser.value?.profile,
)

const userChanged = computed(
  () =>
    !!selectedUser.value &&
    !!props.userOriginal &&
    selectedUser.value.id !== props.userOriginal.id,
)

const handleSelected = (user: User) => {
  emit('selected', user)
}

const handleAction = () => {
  editingUser.value = !editingUser.value
  if (!editingUser.value) {
    selectedUser.value = getUserOriginal()
    emit('cancel', true)
  }
}

const stopEditing = () => {
  editingUser.value = false
}

const clear = () => {
  setTimeout(() => {
    selectedUser.value = undefined
    editingUser.value = false
    userSearchFormRef.value?.clear()
  }, 0)
}

watch(
  () => props.userSelected,
  () => {
    selectedUser.value = props.userSelected
  },
  { immediate: true },
)

watch(
  () => props.userOriginal,
  () => {
    selectedUser.value = props.userOriginal
  },
  { immediate: true },
)

defineExpose({
  editingUser,
  userChanged,
  stopEditing,
  clear,
})
</script>

<template>
  <div>
    <FormLabel v-if="label" :label="label" />

    <div
      :class="[
        'easy-user-search-form-input-component',
        `flex gap-3 grid-cols-[1fr_auto] sm:h-[42px]`,
        !!mappedBreakpoints
          ? mappedBreakpoints
          : showEditButton && 'grid-cols-[minmax(0,1fr)_auto]',
      ]"
    >
      <template v-if="showSelectedUserProfile">
        <ProfileItem
          v-if="selectedUser?.profile"
          class="flex-1"
          :profile="selectedUser.profile"
        />
        <p v-else>{{ t('responsibles.of.not_found') }}</p>
      </template>
      <template v-else>
        <UserSearchForm
          ref="userSearchFormRef"
          class="flex-1"
          :whereRole="whereRole"
          :showLabel="false"
          :invitedToId="invitedToId ?? undefined"
          :showInvite="showInvite"
          full
          @selected="handleSelected"
          @invited="editingUser = false"
        />
      </template>

      <template v-if="clearable">
        <PlayerItemIcon
          v-if="selectedUser"
          class="hover:text-[var(--danger-color)] opacity-40 hover:opacity-100 cursor-pointer scale-125"
          :name="IconNames.times"
          @click.stop="clear"
        />
      </template>
      <Button
        v-else-if="showEditButton"
        :label="editingUser || clearable ? t('forms.cancel') : t('forms.edit')"
        class="action w-min"
        @click.prevent="() => (clearable ? clear() : handleAction())"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'UserSearchFormInput',
}
</script>
