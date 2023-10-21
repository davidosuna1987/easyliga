<script setup lang="ts">
import { TeamMember } from '@/domain/team'

const props = defineProps({
  member: {
    type: Object as PropType<TeamMember>,
    required: false,
  },
  members: {
    type: Array as PropType<TeamMember[]>,
    required: true,
  },
})

const emit = defineEmits(['member:selected'])

const selectedMember = ref<TeamMember | undefined>(props.member)

watch(
  () => selectedMember.value,
  value => {
    emit('member:selected', value)
  },
)
</script>

<template>
  <Dropdown
    v-model="selectedMember"
    class="easy-team-member-selector-component"
    :class="{
      'is-selected': selectedMember,
      'is-unselectable': !!props.member,
    }"
    :options="props.members"
    :placeholder="$t('teams.members')"
  >
    <template #value="slotProps">
      <template v-if="slotProps.value">
        <CoachItem
          v-if="slotProps.value?.coach"
          class="pointer-events-none"
          :coach="slotProps.value"
        />
        <PlayerItem
          v-else
          class="pointer-events-none"
          :player="slotProps.value"
          :selectable="false"
          :showIcons="false"
          :showCaptain="false"
          :showLibero="false"
        />
      </template>
      <template v-else>
        {{ $t('teams.member_select') }}
      </template>
    </template>
    <template #option="slotProps">
      <CoachItem
        v-if="slotProps.option?.coach"
        class="pointer-events-none"
        :coach="slotProps.option"
      />
      <PlayerItem
        v-else
        class="pointer-events-none"
        :player="slotProps.option"
        :selectable="false"
        :showIcons="false"
        :showCaptain="false"
        :showLibero="false"
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
