<script lang="ts" setup>
import { Player, mapProfileToPlayer } from '@/domain/player'
import { User } from '@/domain/user'
import { ROLE_MAPPER } from '@/domain/role'
import { Team } from '@/domain/team'

const props = defineProps({
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
  full: {
    type: Boolean,
    default: false,
  },
  unavailableShirtNumbers: {
    type: Array as PropType<number[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'selected', value: Player): void
  (e: 'invited', value: boolean): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const selectedPlayer = ref<Player>()
const shirtNumberUpdatePlayer = ref<Player>()

const handleRemoveProfile = () => {
  selectedPlayer.value = undefined
}

const handlePlayerSelected = (user: User) => {
  if (!user.profile) return

  selectedPlayer.value = mapProfileToPlayer(user.profile)
  emit('selected', selectedPlayer.value)
}

const setCaptain = () => {
  if (!selectedPlayer.value) return
  selectedPlayer.value.captain = !selectedPlayer.value.captain
}

const setLibero = () => {
  if (!selectedPlayer.value) return
  selectedPlayer.value.libero = !selectedPlayer.value.libero
}

const setShirtNumberUpdatePlayer = () => {
  shirtNumberUpdatePlayer.value = selectedPlayer.value
}

const shirtNumberAlreadyTaken = (shirtNumber: number) => {
  return props.unavailableShirtNumbers.includes(shirtNumber)
}

const changePlayerShirtNumber = (player?: Player) => {
  if (
    !player ||
    !selectedPlayer.value ||
    player.profileId !== selectedPlayer.value.profileId
  ) {
    shirtNumberUpdatePlayer.value = undefined
  } else {
    if (shirtNumberAlreadyTaken(player.shirtNumber)) {
      toast.error(
        t('players.shirt_number_taken', {
          shirtNumber: player.shirtNumber,
        }),
      )
      return
    }

    selectedPlayer.value.shirtNumber = player.shirtNumber
    shirtNumberUpdatePlayer.value = undefined
  }
}
</script>

<template>
  <form class="easy-player-search-form-component">
    <template v-if="!!selectedPlayer">
      <FormLabel :label="t('players.you_selected')" />

      <PlayerItem
        :player="selectedPlayer"
        :selectable="false"
        remove-icon="times"
        :remove-player="handleRemoveProfile"
        :setCaptain="setCaptain"
        :setLibero="setLibero"
        :setShirtNumberUpdatePlayer="setShirtNumberUpdatePlayer"
      />

      <GameCallShirtNumberDialog
        :player="shirtNumberUpdatePlayer"
        @update:player="changePlayerShirtNumber"
        @hide="shirtNumberUpdatePlayer = undefined"
      />
    </template>

    <template v-else>
      <FormLabel :label="t('players.find_by')" />

      <UserSearchForm
        :whereRole="ROLE_MAPPER.player"
        :full="props.full"
        :showLabel="false"
        :invitedToId="props.team.id"
        @selected="handlePlayerSelected"
        @invited="emit('invited', true)"
      />
    </template>
  </form>
</template>

<script lang="ts">
export default {
  name: 'PlayerSearchForm',
}
</script>
