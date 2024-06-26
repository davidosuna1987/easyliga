<script setup lang="ts">
import { TeamMember } from '@/domain/team'
import { Set } from '@/domain/set'
import { Team } from '@/domain/team'
import { Sanction, getPlayerItemSanction } from '@/domain/sanction'

const props = defineProps({
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
  member: {
    type: Object as PropType<TeamMember>,
    required: false,
  },
  members: {
    type: Array as PropType<TeamMember[]>,
    required: true,
  },
  setSanctions: {
    type: Array as PropType<Sanction[]>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'member:selected', value: TeamMember): void
}>()

const { t } = useI18n()

const selectedMember = ref<TeamMember | undefined>(props.member)
</script>

<template>
  <Dropdown
    v-model="selectedMember"
    class="easy-team-member-selector-component"
    :class="{
      'is-selected': !!selectedMember,
      'is-empty': !selectedMember,
      'is-unselectable': !!props.member,
    }"
    :options="props.members"
    :placeholder="t('teams.members')"
    @update:modelValue="emit('member:selected', $event)"
  >
    <template #value="slotProps">
      <template v-if="slotProps.value">
        <CoachItem
          v-if="slotProps.value?.coach"
          class="pointer-events-none"
          :coach="slotProps.value"
          :sanction="
            getPlayerItemSanction(
              props.setSanctions,
              props.currentSet.id,
              props.team.id,
              slotProps.value.profileId,
              'coach',
              'game',
            )
          "
        />
        <PlayerItem
          v-else
          class="pointer-events-none"
          :player="slotProps.value"
          :selectable="false"
          :showIcons="false"
          :showCaptain="false"
          :showLibero="false"
          :sanction="
            getPlayerItemSanction(
              props.setSanctions,
              props.currentSet.id,
              props.team.id,
              slotProps.value.profileId,
              'player',
              'game',
            )
          "
        />
      </template>
      <template v-else>
        {{ t('teams.member_select') }}
      </template>
    </template>
    <template #option="slotProps">
      <CoachItem
        v-if="slotProps.option?.coach"
        class="pointer-events-none"
        :coach="slotProps.option"
        :sanction="
          getPlayerItemSanction(
            props.setSanctions,
            props.currentSet.id,
            props.team.id,
            slotProps.option.profileId,
            'coach',
            'game',
          )
        "
      />
      <PlayerItem
        v-else
        class="pointer-events-none"
        :player="slotProps.option"
        :selectable="false"
        :showIcons="false"
        :showCaptain="false"
        :showLibero="false"
        :sanction="
          getPlayerItemSanction(
            props.setSanctions,
            props.currentSet.id,
            props.team.id,
            slotProps.option.profileId,
            'player',
            'game',
          )
        "
      />
    </template>
    <template #dropdownicon>
      <slot v-if="!!props.member">{{ undefined }}</slot>
    </template>
  </Dropdown>
</template>

<style scoped lang="scss">
.easy-team-member-selector-component {
  &.is-selected {
    background-color: var(--primary-color-lightest);
    border: solid 2px var(--primary-color);
  }

  &.is-empty {
    padding-block: 1rem;
  }

  &.is-unselectable {
    pointer-events: none;

    .p-dropdown-trigger {
      display: none;
      opacity: 0;
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'TeamMemberSelector',
}
</script>
