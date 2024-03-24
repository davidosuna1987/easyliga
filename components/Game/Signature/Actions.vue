<script setup lang="ts">
import {
  GameSignature,
  GameSignatureStoreRequest,
  GameSignatureType,
  GameSignatureTypes,
  mapApiGameSignatureToGameSignature,
  mapGameSignatureStoreRequestToApiGameSignatureStoreRequest,
} from '@/domain/game-signature'
import { Team, TeamType } from '@/domain/team'
import GameSignatureService from '@/services/game-signature'

const props = defineProps<{
  gameId: number
  gameSignatures: GameSignature[]
  teams: {
    local: Team
    visitor: Team
  }
}>()

const emit = defineEmits<{
  (e: 'signature:stored', value: GameSignature): void
}>()

const toast = useEasyToast()
const gameSignatureService = new GameSignatureService()

const selectedSignatureType = ref<GameSignatureType>()
const selectedTeamType = ref<TeamType>()
const showSignatureDialog = ref<boolean>(false)
const loadingSignature = ref<boolean>(false)

const handleOpenSignatureDialog = (
  signatureType: GameSignatureType,
  teamType?: TeamType,
) => {
  selectedSignatureType.value = signatureType
  selectedTeamType.value = teamType
  showSignatureDialog.value = true
}

const handleStoreSignature = async (signature: GameSignatureStoreRequest) => {
  loadingSignature.value = true

  const { data, error } = await gameSignatureService.store(
    props.gameId,
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
  <div class="flex flex-col gap-3">
    <Button
      v-for="gameSignatureType in [
        GameSignatureTypes.coach,
        GameSignatureTypes.captain,
      ]"
      class="px-8"
      :label="
        $t(`reports.signature_type.long.${gameSignatureType}`, {
          teamName: teams.local.name,
        })
      "
      :data-type="gameSignatureType"
      :data-team-name="teams.local.name"
      outlined
      :disabled="
        !!gameSignatures.find(
          signature =>
            signature.type === gameSignatureType &&
            signature.teamId === teams.local.id,
        )
      "
      @click="handleOpenSignatureDialog(gameSignatureType, TeamType.LOCAL)"
    />
    <Button
      class="px-8"
      :label="$t(`reports.signature_type.long.${GameSignatureTypes.referee}`)"
      :data-type="GameSignatureTypes.referee"
      outlined
      :disabled="
        !!gameSignatures.find(
          signature => signature.type === GameSignatureTypes.referee,
        )
      "
      @click="handleOpenSignatureDialog(GameSignatureTypes.referee)"
    />
    <Button
      v-for="gameSignatureType in [
        GameSignatureTypes.coach,
        GameSignatureTypes.captain,
      ]"
      :data-type="gameSignatureType"
      :data-team-name="teams.visitor.name"
      class="px-8"
      :label="
        $t(`reports.signature_type.long.${gameSignatureType}`, {
          teamName: teams.visitor.name,
        })
      "
      outlined
      :disabled="
        !!gameSignatures.find(
          signature =>
            signature.type === gameSignatureType &&
            signature.teamId === teams.visitor.id,
        )
      "
      @click="handleOpenSignatureDialog(gameSignatureType, TeamType.VISITOR)"
    />
    <SignatureDialog
      v-if="selectedSignatureType"
      :visible="showSignatureDialog"
      :loading="loadingSignature"
      :save-inline="false"
      :type="selectedSignatureType"
      :team-type="selectedTeamType"
      :title="
        $t(
          `reports.signature_type.long.${selectedSignatureType}`,
          selectedTeamType &&
            selectedSignatureType !== GameSignatureTypes.referee
            ? { teamName: teams[selectedTeamType].name }
            : {},
        )
      "
      @hide="showSignatureDialog = false"
      @signature:created="handleStoreSignature"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameSignatureActions',
}
</script>
