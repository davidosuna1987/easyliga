<script setup lang="ts">
import { Call } from '@/domain/call'
import { Game } from '@/domain/game'
import {
  GameSignature,
  GameSignatureStoreRequest,
  GameSignatureType,
  mapApiGameSignatureToGameSignature,
  mapGameSignatureStoreRequestToApiGameSignatureStoreRequest,
} from '@/domain/game-signature'
import GameSignatureService from '@/services/game-signature'
import { TeamType } from '@/domain/team'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
  signatureType: {
    type: String as PropType<GameSignatureType>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'signature:stored', value: GameSignature): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const gameSignatureService = new GameSignatureService()
const showSignatureDialog = ref<boolean>(false)
const loadingSignature = ref<boolean>(false)

const actionButtonDisabled = computed(
  () => !!props.call.signedAt || props.disabled,
)

const teamType = computed<TeamType>(() =>
  props.game.localTeamId === props.call.teamId
    ? TeamType.LOCAL
    : TeamType.VISITOR,
)

const onActionButtonClick = () => {
  if (props.call.signedAt) {
    toast.error(t('reports.closed'))
    return
  }
  showSignatureDialog.value = true
}

const handleSignatureCreated = async (signature: GameSignatureStoreRequest) => {
  loadingSignature.value = true

  const { data, error } = await gameSignatureService.store(
    props.game.id,
    mapGameSignatureStoreRequestToApiGameSignatureStoreRequest(signature),
  )

  loadingSignature.value = false

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  showSignatureDialog.value = false

  emit(
    'signature:stored',
    mapApiGameSignatureToGameSignature(data.value.data.game_signature),
  )
}
</script>

<template>
  <Button
    class="action"
    outlined
    :label="t(`reports.signature_type.short.${props.signatureType}`)"
    :disabled="actionButtonDisabled"
    @click="onActionButtonClick"
  />

  <SignatureDialog
    :visible="showSignatureDialog"
    :loading="loadingSignature"
    :save-inline="false"
    :type="props.signatureType"
    :team-type="teamType"
    @hide="showSignatureDialog = false"
    @signature:created="handleSignatureCreated"
  />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonSign',
}
</script>
