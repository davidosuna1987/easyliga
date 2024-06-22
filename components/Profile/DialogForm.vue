<script setup lang="ts">
import { Profile } from '@/domain/profile'
import { UpdateClubTeamPlayer } from '@/domain/player'
import { ApiProfile } from '@/types/api/profile'

const props = defineProps({
  profile: {
    type: Object as PropType<Profile>,
    default: null,
  },
  clubTeamPlayer: {
    type: Object as PropType<UpdateClubTeamPlayer>,
    required: false,
  },
  hideAvatar: {
    type: Boolean,
    default: false,
  },
  hidePlayerId: {
    type: Boolean,
    default: false,
  },
  hideRoles: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const emit = defineEmits(['updated', 'hide'])

const showDialog = ref<boolean>(!!props.profile)

const handleProfileFormUpdated = (apiProfile: ApiProfile) => {
  emit('updated', apiProfile)
}

watch(
  () => props.profile,
  value => {
    showDialog.value = !!value
  },
)
</script>

<template>
  <DialogBottom
    class="easy-profile-dialog-form-component"
    :visible="showDialog"
    @hide="$emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ t('profiles.edit') }}</Heading>
    </template>

    <ProfileForm
      :profile="profile"
      :clubTeamPlayer="clubTeamPlayer"
      :hideAvatar="hideAvatar"
      :hidePlayerId="hidePlayerId"
      :hideRoles="hideRoles"
      @updated="handleProfileFormUpdated"
    />
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'ProfileDialogForm',
}
</script>
