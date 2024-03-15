<script setup lang="ts">
import { Profile } from '@/domain/profile'
import { UpdateClubTeamPlayer } from '@/components/Profile/Form.vue'
import { ApiProfile } from 'types/api/profile'

const emit = defineEmits(['updated', 'hide'])

const props = defineProps({
  profile: {
    type: Object as PropType<Profile>,
    default: null,
  },
  clubTeamPlayer: {
    type: Object as PropType<UpdateClubTeamPlayer>,
    required: false,
  },
})

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
      <Heading tag="h5">{{ $t('profiles.edit') }}</Heading>
    </template>

    <ProfileForm
      :profile="profile"
      :clubTeamPlayer="clubTeamPlayer"
      hideAvatar
      @updated="handleProfileFormUpdated"
    />

    <!-- <template #footer>
      <Button
        class="mt-3"
        type="button"
        :label="$t('shirts.number_change_short')"
        :loading="false"
        @click="updateProfile"
      />
    </template> -->
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'ProfileDialogForm',
}
</script>
