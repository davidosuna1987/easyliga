<script setup lang="ts">
import InfoRequestService from '@/services/info-request'
import {
  INFO_REQUEST_MESSAGE_MAX_WIDTH,
  INFO_REQUEST_STATUS_COLOR_MAP,
  INFO_REQUEST_STATUS_MAP,
  InfoRequest,
  InfoRequestDialogType,
  mapApiInfoRequestToInfoRequest,
} from '@/domain/info-request'
import { formatDate } from '@/domain/utils'
import { ROLE_MAPPER } from '@/domain/role'

const props = defineProps({
  infoRequests: {
    type: Array as PropType<InfoRequest[]>,
    required: false,
  },
})

const { t } = useI18n()
const toast = useEasyToast()

const infoRequestService = new InfoRequestService()

const infoRequests = ref<InfoRequest[]>([])
const dialogInfoRequest = ref<InfoRequest>()
const infoRequestDialogType = ref<InfoRequestDialogType>()
const replyMessage = ref<string>()
const loadingApi = ref<boolean>(false)

const dialogInfoRequestTitle = computed(() => {
  if (!dialogInfoRequest.value) return

  return dialogInfoRequest.value.infoOnly
    ? t('info_requests.info_request')
    : t('info_requests.register_request')
})

const dialogInfoRequestName = computed(() => {
  if (!dialogInfoRequest.value) return

  return dialogInfoRequest.value.name ?? dialogInfoRequest.value.email
})

const getInfoRequests = async () => {
  if (props.infoRequests) {
    infoRequests.value = props.infoRequests
    return
  }

  loadingApi.value = true
  const { data } = await infoRequestService.fetch()

  infoRequests.value = data.value?.data.info_requests
    ? data.value.data.info_requests.map(mapApiInfoRequestToInfoRequest)
    : []

  loadingApi.value = false
}

const updateInfoRequestStatus = async (reply: boolean = false) => {
  if (!dialogInfoRequest.value) return
  if (
    dialogInfoRequest.value.status === INFO_REQUEST_STATUS_MAP.read &&
    !reply
  ) {
    hideDialog()
    return
  }
  if (dialogInfoRequest.value.status === INFO_REQUEST_STATUS_MAP.replied) {
    hideDialog()
    return
  }

  switch (dialogInfoRequest.value.status) {
    case INFO_REQUEST_STATUS_MAP.new:
      dialogInfoRequest.value.status = INFO_REQUEST_STATUS_MAP.read
      break
    case INFO_REQUEST_STATUS_MAP.read:
      dialogInfoRequest.value.status = INFO_REQUEST_STATUS_MAP.replied
      break
  }

  loadingApi.value = true

  const { error } = await infoRequestService.update(
    dialogInfoRequest.value.id,
    dialogInfoRequest.value,
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  }

  loadingApi.value = false

  hideDialog()
}

const hideDialog = () => {
  dialogInfoRequest.value = undefined
  infoRequestDialogType.value = undefined
}

const handleDialogMessage = (infoRequest: InfoRequest) => {
  replyMessage.value = undefined
  dialogInfoRequest.value = infoRequest
  infoRequestDialogType.value = infoRequest.message ? 'reply' : 'status'
}

const handleDialogInvite = (infoRequest: InfoRequest) => {
  dialogInfoRequest.value = infoRequest
  infoRequestDialogType.value = 'invite'
}

onMounted(() => {
  getInfoRequests()
})
</script>

<template>
  <div class="easy-info-request-table-component w-full overflow-scroll">
    <div class="easy-table table w-full">
      <div class="easy-table-row hidden md:table-row font-bold">
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span v-tooltip.top="t('#')">#</span>
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span v-tooltip.top="t('forms.email')">{{ t('forms.email') }}</span>
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span v-tooltip.top="t('forms.name')">
            {{ t('forms.name') }}
          </span>
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span v-tooltip.top="t('forms.phone')">
            {{ t('forms.phone') }}
          </span>
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span v-tooltip.top="t('pricing_plans.plan')">
            {{ t('pricing_plans.pricing_plan') }}
          </span>
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span v-tooltip.top="t('forms.status')">
            {{ t('forms.status') }}
          </span>
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span v-tooltip.top="t('pricing_plans.interest')">
            {{ t('pricing_plans.interest') }}
          </span>
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span v-tooltip.top="t('forms.date')">
            {{ t('forms.date') }}
          </span>
        </div>
      </div>

      <div
        v-for="row in infoRequests"
        :key="row.id"
        class="easy-table-row table-row"
      >
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span class="font-bold mr-3 md:hidden">{{ t('#') }}:</span>
          <span>{{ row.id }}</span>
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span class="font-bold mr-3 md:hidden">
            {{ t('forms.email') }}:
          </span>
          <span>{{ row.email }}</span>
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span class="font-bold mr-3 md:hidden"> {{ t('forms.name') }}: </span>
          <span>{{ row.name }}</span>
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span class="font-bold mr-3 md:hidden">
            {{ t('forms.phone') }}:
          </span>
          <span>
            {{ row.phone }}
          </span>
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span class="font-bold mr-3 md:hidden">
            {{ t('pricing_plans.plan') }}:
          </span>
          <EasyDoubleChip
            :left="row.pricingPlan?.toLocaleLowerCase()"
            :right="row.temporality"
            background="hero-purple"
            color="var(--foreground-color)"
          />
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span class="font-bold mr-3 md:hidden">
            {{ t('forms.status') }}:
          </span>
          <EasyDoubleChip
            class="cursor-pointer"
            :left="row.status"
            :background="INFO_REQUEST_STATUS_COLOR_MAP[row.status]"
            color="var(--foreground-color)"
            @click.prevent="handleDialogMessage(row)"
          />
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span class="font-bold mr-3 md:hidden">
            {{ t('pricing_plans.interest') }}:
          </span>
          <EasyDoubleChip
            class="cursor-pointer"
            :left="row.infoOnly ? 'info' : 'register'"
            :background="row.infoOnly ? 'warning-color' : 'primary-color'"
            color="var(--foreground-color)"
            @click.prevent="handleDialogInvite(row)"
          />
        </div>
        <div
          class="easy-table-cell flex justify-between md:table-cell border-solid border-0 border-b border-[var(--input-border-color)] py-2 px-1"
        >
          <span class="font-bold mr-3 md:hidden"> {{ t('forms.date') }}: </span>
          <span>{{ formatDate(row.createdAt) }}</span>
        </div>
      </div>
    </div>

    <UserInviteDialog
      :visible="dialogInfoRequest && infoRequestDialogType === 'invite'"
      :roles="[ROLE_MAPPER.user, ROLE_MAPPER.club]"
      :email="dialogInfoRequest?.email"
      @hide="hideDialog"
    >
    </UserInviteDialog>

    <DialogBottom
      class="easy-info-request-message-dialog-component"
      :visible="dialogInfoRequest && infoRequestDialogType !== 'invite'"
      @hide="
        updateInfoRequestStatus(
          dialogInfoRequest?.status === INFO_REQUEST_STATUS_MAP.new,
        )
      "
    >
      <template #header>
        <div class="w-full mr-6">
          <div class="flex justify-between items-center w-full">
            <Heading tag="h6">{{ dialogInfoRequestTitle }}</Heading>
            <EasyDoubleChip
              class="cursor-pointer"
              :left="dialogInfoRequest!.status"
              :background="INFO_REQUEST_STATUS_COLOR_MAP[dialogInfoRequest!.status]"
              color="var(--foreground-color)"
            />
          </div>
          <p>{{ dialogInfoRequestName }}</p>
        </div>
      </template>

      <div class="my-6">
        <EasyBlockquote v-if="dialogInfoRequest?.message">
          {{ dialogInfoRequest?.message }}
        </EasyBlockquote>
        <p v-else class="opacity-50">
          {{ t('info_requests.no_message', { name: dialogInfoRequestName }) }}
        </p>
      </div>

      <FormLabel :label="t('forms.reply')">
        <EasyTextarea
          v-if="infoRequestDialogType === 'reply'"
          class="mb-6"
          v-model="replyMessage"
          :maxLength="INFO_REQUEST_MESSAGE_MAX_WIDTH"
          :disabled="loadingApi"
        />
      </FormLabel>

      <template #stickyFooter>
        <FormFooterActions
          :submitLabel="t('forms.reply')"
          :cancelLabel="t('forms.close')"
          :disabled="loadingApi"
          :hideSubmit="infoRequestDialogType !== 'reply'"
          @form:cancel="
            updateInfoRequestStatus(
              dialogInfoRequest?.status === INFO_REQUEST_STATUS_MAP.new,
            )
          "
          @form:submit="updateInfoRequestStatus(true)"
        />
      </template>
    </DialogBottom>
  </div>
</template>

<script lang="ts">
export default {
  name: 'InfoRequestTable',
}
</script>
