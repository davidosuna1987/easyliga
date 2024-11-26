<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import FederationService from '@/services/federation'
import {
  Federation,
  mapApiFederationToFederation,
  flattenFederations,
  mapFederationRefereeStoreRequestToApiFederationRefereeStoreRequest,
  FederationRefereeStoreRequest,
  mapFederationRefereeAddRequestToApiFederationRefereeAddRequest,
  FederationRefereeAddRequest,
} from '@/domain/federation'

const props = defineProps({
  isRefereeAdmin: {
    type: Boolean,
    required: false,
  },
})

const { t } = useI18n()
const auth = useAuthStore()
const toast = useEasyToast()
const federationService = new FederationService()

const groupedReferees = ref<Federation[]>()
const showRefereeFormDialog = ref<Federation>()
const removeRefereeForm = ref<{ federationId: number; userId: number }>()
const loadingApi = ref<boolean>(false)

const getReferees = async () => {
  if (!auth.user) return

  loadingApi.value = true
  const { data } = await federationService.fetch({
    where: props.isRefereeAdmin
      ? `id:in:${auth.refereeAdministratedFederationIds}`
      : `responsible_id:${auth.user.id}`,
    with: 'referees.profile,federations.referees.profile',
  })

  if (data.value) {
    groupedReferees.value = flattenFederations(
      data.value?.data.federations.map(mapApiFederationToFederation),
    )
  }

  loadingApi.value = false
}

const handleShowRefereeFormDialog = (federation: Federation) => {
  showRefereeFormDialog.value = federation
}

const handleAddReferee = async (request: FederationRefereeAddRequest) => {
  loadingApi.value = true
  const { data, error } = await federationService.addReferee(
    mapFederationRefereeAddRequestToApiFederationRefereeAddRequest(request),
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    loadingApi.value = false
  } else if (data.value) {
    toast.success(t('referees.added'))
    showRefereeFormDialog.value = undefined
    getReferees()
  }

  loadingApi.value = false
}

const handleCreateReferee = async (request: FederationRefereeStoreRequest) => {
  loadingApi.value = true

  const { data, error } = await federationService.createReferee(
    mapFederationRefereeStoreRequestToApiFederationRefereeStoreRequest(request),
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    loadingApi.value = false
  } else if (data.value) {
    toast.success(t('referees.added'))
    showRefereeFormDialog.value = undefined
    getReferees()
  }
}

const setRefereeToRemove = (federation: Federation, profileId: number) => {
  const referee = federation?.referees?.find(
    ref => ref.profile?.id === profileId,
  )

  if (!federation || !referee) return

  removeRefereeForm.value = {
    federationId: federation.id,
    userId: referee.id,
  }
}

const handleRemoveReferee = async () => {
  if (!removeRefereeForm.value) return

  loadingApi.value = true

  const { data, error } = await federationService.removeReferee(
    removeRefereeForm.value.federationId,
    removeRefereeForm.value.userId,
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    loadingApi.value = false
  } else if (data.value) {
    toast.success(t('referees.deleted'))
    removeRefereeForm.value = undefined
    getReferees()
  }
}

onMounted(getReferees)
</script>

<template>
  <div class="easy-referee-list-component">
    <Loading v-if="loadingApi" />
    <template v-else>
      <EasyGrid v-if="groupedReferees?.length" :gap="5">
        <div class="mb-3" v-for="federation in groupedReferees">
          <header class="header grid grid-cols-[1fr_auto] items-start mb-1">
            <Heading tag="h6">{{ federation.name }}</Heading>
            <ListActionButton
              class="mt-1"
              :label="t('referees.add')"
              :onClick="() => handleShowRefereeFormDialog(federation)"
            />
          </header>

          <EasyGrid
            v-if="federation.referees?.length"
            class="federatoin-referees-list"
            :breakpoints="{ sm: 2, lg: 3, xl: 4 }"
            :gap="3"
          >
            <template v-for="referee in federation.referees">
              <ProfileItem
                v-if="referee.profile"
                :profile="referee.profile"
                :onRemove="
                  auth.user?.id === referee.profile.id
                    ? undefined
                    : profileId => setRefereeToRemove(federation, profileId)
                "
                :removeTooltip="t('referees.delete')"
                :tag="referee.pivot?.admin ? 'admin' : undefined"
              />
            </template>
          </EasyGrid>

          <p v-else class="opacity-60">
            {{ t('federations.referee_list_empty') }}
          </p>
        </div>
      </EasyGrid>
      <p v-else class="text-center">
        {{ t('federations.no_managed') }}
      </p>
    </template>

    <RefereeSearchFormDialog
      v-if="showRefereeFormDialog"
      :visible="!!showRefereeFormDialog"
      :federation="showRefereeFormDialog"
      @referee:add="handleAddReferee"
      @referee:create="handleCreateReferee"
      @hide="showRefereeFormDialog = undefined"
    />

    <AlertDialog
      :visible="!!removeRefereeForm"
      :title="t('referees.delete')"
      :message="t('referees.delete_alert')"
      :acceptLabel="t('forms.delete')"
      severity="danger"
      :disabled="loadingApi"
      @accepted="handleRemoveReferee"
      @hide="removeRefereeForm = undefined"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'FederationRefereeList',
}
</script>
