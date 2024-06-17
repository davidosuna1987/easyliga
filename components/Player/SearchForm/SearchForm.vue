<script lang="ts" setup>
import ProfileService from '@/services/profile'
import { Profile, mapApiProfileToProfile } from '@/domain/profile'
import { AutoCompleteItemSelectEvent } from 'primevue/autocomplete'
import { Player, mapProfileToPlayer } from '@/domain/player'

const props = defineProps({
  full: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['selected'])

const { t } = useI18n()
const toast = useEasyToast()
const profileService = new ProfileService()

const search = ref<string>('')
const selectedPlayer = ref<Player>()
const matchProfiles = ref<Profile[]>()
const shirtNumberUpdatePlayer = ref<Player>()
const loadingApi = ref<boolean>(false)

const searchPlayers = async () => {
  if (search.value.length < 3) return
  loadingApi.value = true
  const { data, error } = await profileService.search({
    search: search.value,
  })

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    matchProfiles.value = data.value.data.profiles.map(mapApiProfileToProfile)
  }

  loadingApi.value = false
}

const handleRemoveProfile = () => {
  selectedPlayer.value = undefined
  search.value = ''
}

const handlePlayerSelected = (event: AutoCompleteItemSelectEvent) => {
  selectedPlayer.value = mapProfileToPlayer(event.value)
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

const changePlayerShirtNumber = (player?: Player) => {
  if (
    !player ||
    !selectedPlayer.value ||
    player.profileId !== selectedPlayer.value.profileId
  ) {
    shirtNumberUpdatePlayer.value = undefined
  } else {
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
      <Message :closable="false">{{ t('players.add_disclaimer') }}</Message>
      <GameCallShirtNumberDialog
        :player="shirtNumberUpdatePlayer"
        @update:player="changePlayerShirtNumber"
        @hide="shirtNumberUpdatePlayer = undefined"
      />
    </template>
    <template v-else>
      <FormLabel :label="t('players.type_name')" />
      <AutoComplete
        v-model="search"
        optionLabel="first_name"
        :class="{ 'w-full': props.full }"
        :input-class="{ 'w-full': props.full }"
        :suggestions="matchProfiles"
        @complete="searchPlayers"
        @item-select="handlePlayerSelected"
      >
        <template #option="slotProps">
          <ProfileItem
            class="pointer-events-none"
            :profile="slotProps.option"
            :selectable="false"
          />
        </template>
      </AutoComplete>
    </template>
  </form>
</template>
