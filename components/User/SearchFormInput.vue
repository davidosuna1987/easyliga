<script setup lang="ts">
import { User } from '@/domain/user'
import { InvitedRole } from '@/domain/invite'
import { GridBreakpoints, mapBreakpointsToClasses } from '@/domain/grid'

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
  label: {
    type: String,
    required: false,
  },
  readonly: {
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

const editingUser = ref<boolean>(false)
const selectedUser = ref<User | undefined>(props.userOriginal)

const mappedBreakpoints = computed(() =>
  props.breakpoints ? mapBreakpointsToClasses(props.breakpoints) : undefined,
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
    selectedUser.value = props.userOriginal
    emit('cancel', true)
  }
}

const stopEditing = () => {
  editingUser.value = false
}

watch(
  () => props.userSelected,
  () => {
    selectedUser.value = props.userSelected
  },
  { immediate: true },
)

defineExpose({
  editingUser,
  userChanged,
  stopEditing,
})
</script>

<template>
  <FormLabel v-if="label" :label="label" />

  <div
    :class="[
      'easy-user-search-form-input-component',
      `flex gap-3 h-[42px]`,
      !!mappedBreakpoints
        ? mappedBreakpoints
        : 'grid-cols-[minmax(0,1fr)_auto]',
    ]"
  >
    <template v-if="!!readonly || (selectedUser?.profile && !editingUser)">
      <ProfileItem
        v-if="selectedUser?.profile"
        class="flex-1"
        :profile="selectedUser.profile"
      />
      <p v-else>{{ t('responsibles.of.not_found') }}</p>
    </template>
    <template v-else>
      <UserSearchForm
        class="flex-1"
        :whereRole="whereRole"
        :showLabel="false"
        :invitedToId="invitedToId ?? undefined"
        full
        @selected="handleSelected"
        @invited="editingUser = false"
      />
    </template>

    <Button
      v-if="!readonly && selectedUser?.profile"
      :label="editingUser ? t('forms.cancel') : t('forms.edit')"
      class="action w-min"
      @click.prevent="handleAction"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'UserSearchFormInput',
}
</script>
