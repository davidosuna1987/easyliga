<script setup lang="ts">
import {
  Rotation,
  RotationPlayer,
  RotationPlayerChange,
  RotationWindowPlayerChange,
  mapRotationPlayersToRotationPlayerChanges,
  mapRotationToRotationWindowPlayerChanges,
  playerInProfileId,
  playerOutProfileId,
} from '@/domain/rotation'
import { Call, CallPlayerData } from '@/domain/call'
import { TeamSide, TeamSideEnum } from '@/domain/team'
import { Injury, mapInjuryToPlayerInOut } from '@/domain/injury'

const props = defineProps({
  leftSideTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  rightSideTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  leftSideTeamRotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  rightSideTeamRotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  leftSideTeamInjuries: {
    type: Array as PropType<Injury[]>,
    required: true,
  },
  rightSideTeamInjuries: {
    type: Array as PropType<Injury[]>,
    required: true,
  },
  pendingPlayerChanges: {
    type: Array as PropType<RotationPlayer[]>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'pendingPlayerChange:show', value: RotationPlayer): void
}>()

const { t } = useI18n()

const selectedTeamSide = ref<TeamSide>()

const playerChanges = computed((): RotationPlayerChange[] => {
  switch (selectedTeamSide.value) {
    case TeamSideEnum.left:
      return leftSideTeamPlayerChanges.value ?? []
    case TeamSideEnum.right:
      return rightSideTeamPlayerChanges.value ?? []
    default:
      return []
  }
})

const injuries = computed((): Injury[] => {
  switch (selectedTeamSide.value) {
    case TeamSideEnum.left:
      return props.leftSideTeamInjuries.filter(i => !i.isPlayerChangeInjury)
    case TeamSideEnum.right:
      return props.rightSideTeamInjuries.filter(i => !i.isPlayerChangeInjury)
    default:
      return []
  }
})

const injuryCallPlayers = computed((): CallPlayerData[] => {
  switch (selectedTeamSide.value) {
    case TeamSideEnum.left:
      return props.leftSideTeamCall.playersData
    case TeamSideEnum.right:
      return props.rightSideTeamCall.playersData
    default:
      return []
  }
})

const windowPlayerChanges = computed((): RotationWindowPlayerChange[] => {
  switch (selectedTeamSide.value) {
    case TeamSideEnum.left:
      return leftSideTeamWindowPlayerChanges.value ?? []
    case TeamSideEnum.right:
      return rightSideTeamWindowPlayerChanges.value ?? []
    default:
      return []
  }
})

const rotation = computed((): Rotation | undefined => {
  switch (selectedTeamSide.value) {
    case TeamSideEnum.left:
      return props.leftSideTeamRotation
    case TeamSideEnum.right:
      return props.rightSideTeamRotation
    default:
      return undefined
  }
})

const leftSideTeamPlayerChanges = computed(
  () =>
    props.leftSideTeamRotation &&
    mapRotationPlayersToRotationPlayerChanges(
      props.leftSideTeamRotation.players,
      props.leftSideTeamCall.playersData,
    ),
)

const rightSideTeamPlayerChanges = computed(
  () =>
    props.rightSideTeamRotation &&
    mapRotationPlayersToRotationPlayerChanges(
      props.rightSideTeamRotation.players,
      props.rightSideTeamCall.playersData,
    ),
)

const leftSideTeamWindowPlayerChanges = computed(
  () =>
    props.leftSideTeamRotation &&
    mapRotationToRotationWindowPlayerChanges(
      props.leftSideTeamRotation,
      props.leftSideTeamCall.playersData,
    ),
)

const rightSideTeamWindowPlayerChanges = computed(
  () =>
    props.rightSideTeamRotation &&
    mapRotationToRotationWindowPlayerChanges(
      props.rightSideTeamRotation,
      props.rightSideTeamCall.playersData,
    ),
)

const leftSideTeamPendingPlayerChanges = computed(
  (): RotationPlayer[] | undefined =>
    props.pendingPlayerChanges?.filter(playerChange =>
      props.leftSideTeamCall.playersData
        .map(pd => pd.profileId)
        .includes(playerChange.profileId),
    ),
)

const rightSideTeamPendingPlayerChanges = computed(
  (): RotationPlayer[] | undefined =>
    props.pendingPlayerChanges?.filter(playerChange =>
      props.rightSideTeamCall.playersData
        .map(pd => pd.profileId)
        .includes(playerChange.profileId),
    ),
)

const leftSideTeamPendingPlayerChangeToShow = computed(
  (): RotationPlayer | undefined => {
    if (!leftSideTeamPendingPlayerChanges.value) return
    return leftSideTeamPendingPlayerChanges.value[0]
  },
)

const rightSideTeamPendingPlayerChangeToShow = computed(
  (): RotationPlayer | undefined => {
    if (!rightSideTeamPendingPlayerChanges.value) return
    return rightSideTeamPendingPlayerChanges.value[0]
  },
)

const leftTeamPendingPlayerChangePlayerIn = computed(
  (): CallPlayerData | undefined => {
    if (!leftSideTeamPendingPlayerChangeToShow.value) return

    return props.leftSideTeamCall.playersData?.find(
      player =>
        player.profileId ===
        playerInProfileId(leftSideTeamPendingPlayerChangeToShow.value),
    )
  },
)

const leftTeamPendingPlayerChangePlayerOut = computed(
  (): CallPlayerData | undefined => {
    if (!leftSideTeamPendingPlayerChangeToShow.value) return

    return props.leftSideTeamCall.playersData?.find(
      player =>
        player.profileId ===
        playerOutProfileId(leftSideTeamPendingPlayerChangeToShow.value),
    )
  },
)

const rightTeamPendingPlayerChangePlayerIn = computed(
  (): CallPlayerData | undefined => {
    if (!rightSideTeamPendingPlayerChangeToShow.value) return

    return props.rightSideTeamCall.playersData?.find(
      player =>
        player.profileId ===
        playerInProfileId(rightSideTeamPendingPlayerChangeToShow.value),
    )
  },
)

const rightTeamPendingPlayerChangePlayerOut = computed(
  (): CallPlayerData | undefined => {
    if (!rightSideTeamPendingPlayerChangeToShow.value) return

    return props.rightSideTeamCall.playersData?.find(
      player =>
        player.profileId ===
        playerOutProfileId(rightSideTeamPendingPlayerChangeToShow.value),
    )
  },
)

const numberToString = (playerChangesCount: number = 0) =>
  playerChangesCount.toString()

const removePlayerChange = async (playerChange: RotationPlayerChange) => {
  const targetRotation = props.leftSideTeamRotation?.players.find(player =>
    [playerChange.in.profileId, playerChange.out.profileId].includes(
      player.profileId,
    ),
  )
    ? props.leftSideTeamRotation
    : props.rightSideTeamRotation

  // TODO: Implement this method
}
</script>

<template>
  <div class="easy-game-changes-actions-component">
    <EasyGrid class="actions" :cols="2" :gap="3">
      <Button
        v-if="
          leftSideTeamPendingPlayerChangeToShow &&
          leftTeamPendingPlayerChangePlayerIn &&
          leftTeamPendingPlayerChangePlayerOut
        "
        class="relative pr-[4.25rem] justify-center col-span-5/10"
        severity="warning"
        @click.prevent="
          emit(
            'pendingPlayerChange:show',
            leftSideTeamPendingPlayerChangeToShow,
          )
        "
      >
        <span>{{ t('player_change_requests.pending') }}</span>
        <img
          class="arrows-icon absolute right-[1.25rem]"
          src="/icons/change-player.svg"
          width="30"
        />
        <img
          class="arrows-icon absolute right-[1.25rem] animate-ping"
          src="/icons/change-player.svg"
          width="30"
        />
      </Button>
      <Button
        v-else
        class="col-span-5/10"
        :label="t('games.show_player_change', 2)"
        :badge="numberToString(leftSideTeamRotation?.playerChangesCount)"
        badgeClass="is-primary"
        outlined
        @click.prevent="selectedTeamSide = TeamSideEnum.left"
      />
      <Button
        v-if="
          rightSideTeamPendingPlayerChangeToShow &&
          rightTeamPendingPlayerChangePlayerIn &&
          rightTeamPendingPlayerChangePlayerOut
        "
        class="relative pr-[4.25rem] justify-center col-span-5/10"
        severity="warning"
        @click.prevent="
          emit(
            'pendingPlayerChange:show',
            rightSideTeamPendingPlayerChangeToShow,
          )
        "
      >
        <span>{{ t('player_change_requests.pending') }}</span>
        <img
          class="arrows-icon absolute right-[1.25rem]"
          src="/icons/change-player.svg"
          width="30"
        />
        <img
          class="arrows-icon absolute right-[1.25rem] animate-ping"
          src="/icons/change-player.svg"
          width="30"
        />
      </Button>
      <Button
        v-else
        class="col-span-5/10"
        :label="t('games.show_player_change', 2)"
        :badge="numberToString(rightSideTeamRotation?.playerChangesCount)"
        badgeClass="is-primary"
        outlined
        @click.prevent="selectedTeamSide = TeamSideEnum.right"
      />
    </EasyGrid>

    <DialogBottom
      class="easy-game-changes-dialog-component"
      :visible="!!selectedTeamSide"
      :hasStickyFooter="false"
      @hide="selectedTeamSide = undefined"
    >
      <template #header>
        <Heading tag="h6">{{ t('rotations.player_change_done', 2) }}</Heading>
      </template>

      <Message v-if="playerChanges?.length === 0" :closable="false">
        {{ t('rotations.player_change_done', 0) }}
      </Message>

      <template v-if="playerChanges">
        <RotationPlayerChangeItem
          v-for="(change, index) in playerChanges"
          :key="index"
          class="mt-4"
          :playerIn="change.in"
          :playerOut="change.out"
          :injured="!!change.injured"
          @change:remove="removePlayerChange(change)"
        />
      </template>
      <!-- <template
        v-if="windowPlayerChanges"
        v-for="windowPlayerChange in windowPlayerChanges"
      >
        <div
          v-for="(playerChanges, changeWindow) in windowPlayerChange"
          :key="changeWindow"
          class="mt-3 mb-6"
        >
          <Heading tag="h6">
            {{ t('games.change_window_num', { num: changeWindow }) }}
          </Heading>

          <RotationPlayerChangeItem
            v-for="(change, index) in playerChanges"
            :key="index"
            class="mt-4"
            :playerIn="change.in"
            :playerOut="change.out"
            :injured="!!change.injured"
            :action="
              // TODO: Implement this method when remove player changes also captain to previous one
              // playerChangeCanBeRemoved(
              //   change,
              //   rotation?.currentChangeWindow ?? 0,
              // )
              //   ? 'remove'
              //   : 'done'
              undefined
            "
            @change:remove="removePlayerChange(change)"
          />
        </div>
      </template> -->
      <div v-if="injuries.length" class="mt-8">
        <header class="flex items-center gap-2 mb-3">
          <IconInjury size="1.25rem" />
          <p>{{ t('injuries.extraordinay_change', 2) }}</p>
        </header>

        <div v-for="injury of injuries" class="mt-4">
          <RotationPlayerChangeItem
            v-if="mapInjuryToPlayerInOut(injury, injuryCallPlayers)"
            :playerIn="mapInjuryToPlayerInOut(injury, injuryCallPlayers)?.in!"
            :playerOut="mapInjuryToPlayerInOut(injury, injuryCallPlayers)?.out!"
            injured
          />
        </div>
      </div>
    </DialogBottom>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameChangesActions',
}
</script>

<style lang="scss">
.easy-game-changes-actions-component {
  max-width: var(--court-max-width);
  margin: 0 auto;
}
</style>
