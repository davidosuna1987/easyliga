<script setup lang="ts">
import { Team } from '@/domain/team'
import { Player } from '@/domain/player'

const toast = useEasyToast()

const props = defineProps({
  team: {
    type: Object as PropType<Team>,
    required: false,
  },
})

const form = ref<Team>({
  id: 0,
  name: '',
  division: undefined,
  category: undefined,
  gender: undefined,
  coach: undefined,
  players: undefined,
})

const shirtNumberUpdatePlayer = ref<Player>()
const playerToRemove = ref<Player>()

const setFormData = (team: Team) => {
  form.value = team
}

const setCaptain = (id: number) => {
  const player = form.value.players?.find(player => player.profileId === id)
  if (player) {
    player.captain = !player.captain
  }
}

const setLibero = (id: number) => {
  const player = form.value.players?.find(player => player.profileId === id)
  if (player) {
    player.libero = !player.libero
  }
}

const removePlayerAlert = (id: number) => {
  playerToRemove.value = form.value.players?.find(
    player => player.profileId === id,
  )
}

const removePlayer = (id?: number) => {
  form.value.players = form.value.players?.filter(
    player => player.profileId !== id,
  )
  playerToRemove.value = undefined
}

const shirtNumberAlreadyTaken = (player: Player) => {
  return form.value?.players?.find(
    p =>
      p.profileId !== player.profileId && p.shirtNumber === player.shirtNumber,
  )
}

const setShirtNumberUpdatePlayer = (player: Player) => {
  shirtNumberUpdatePlayer.value = player
}

const changePlayerShirtNumber = (player?: Player) => {
  if (
    !player ||
    !form.value.players?.find(p => p.profileId === player.profileId)
  ) {
    shirtNumberUpdatePlayer.value = undefined
  } else {
    if (shirtNumberAlreadyTaken(player)) {
      toast.error(
        useNuxtApp().$i18n.t('players.shirt_number_taken', {
          shirtNumber: player.shirtNumber,
        }),
      )
      return
    }
    form.value.players?.map(p => {
      if (p.profileId === player.profileId) {
        p.shirtNumber = player.shirtNumber
      }
    })

    shirtNumberUpdatePlayer.value = undefined
  }
}

watch(
  () => props.team,
  value => {
    if (value) {
      setFormData(value)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <form class="easy-team-form-component">
    <FormLabel :label="$t('forms.name')">
      <InputText v-model="form.name" />
    </FormLabel>
    <div class="grid gap-3 sm:grid-cols-3 mt-3">
      <FormLabel :label="$t('divisions.division')">
        <DivisionSelector v-model="form.division" />
      </FormLabel>
      <FormLabel :label="$t('categories.category')">
        <CategorySelector v-model="form.category" />
      </FormLabel>
      <FormLabel :label="$t('genders.gender')">
        <GenderSelector v-model="form.gender" />
      </FormLabel>
    </div>
    <div class="players mt-10">
      <FormLabel :label="$t('players.player', 2)" />
      <div class="players-list grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <PlayerItem
          v-for="player in form.players"
          :key="player.profileId"
          :player="player"
          :setCaptain="setCaptain"
          :setLibero="setLibero"
          :setShirtNumberUpdatePlayer="setShirtNumberUpdatePlayer"
          :removePlayer="removePlayerAlert"
        />
      </div>
    </div>
    <GameCallShirtNumberDialog
      :player="shirtNumberUpdatePlayer"
      @update:player="changePlayerShirtNumber"
      @hide="shirtNumberUpdatePlayer = undefined"
    />
    <AlertDialog
      :visible="!!playerToRemove"
      :title="`${playerToRemove?.firstName} ${playerToRemove?.lastName}`"
      :message="$t('players.delete_alert')"
      :acceptLabel="$t('forms.delete')"
      severity="danger"
      @accepted="removePlayer(playerToRemove?.profileId)"
      @hide="playerToRemove = undefined"
    />
  </form>
</template>
