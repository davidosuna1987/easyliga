<script setup lang="ts">
import { Team } from '@/domain/team'
import { SetStartRequest } from '@/domain/set'

const props = defineProps({
  localTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  visitorTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
})

const emit = defineEmits(['set:start'])

const form = ref<SetStartRequest>({
  localTeamSide: 'left',
  visitorTeamSide: 'right',
  firstServeTeamId: 0,
})
const firstServeTeam = ref<Team>()

const leftSideTeam = computed(() => {
  return form.value.localTeamSide === 'left'
    ? props.localTeam
    : props.visitorTeam
})

const rightSideTeam = computed(() => {
  return form.value.localTeamSide === 'right'
    ? props.localTeam
    : props.visitorTeam
})

const switchTeamSides = () => {
  const localTeamSide = form.value.localTeamSide
  const visitorTeamSide = form.value.visitorTeamSide

  form.value.localTeamSide = visitorTeamSide
  form.value.visitorTeamSide = localTeamSide
}

const setFirstServeTeam = (firstServeTeam: Team) => {
  form.value.firstServeTeamId = firstServeTeam.id
}
</script>

<template>
  <form
    class="easy-set-start-form-component"
    @submit.prevent="emit('set:start', form)"
  >
    <FormLabel :label="$t('sets.select_team_sides')" />
    <div class="team-sides-container">
      <div class="team">
        {{ leftSideTeam.name }}
      </div>
      <Icon name="ic:round-loop" class="switch" @click="switchTeamSides" />
      <div class="team">
        {{ rightSideTeam.name }}
      </div>
    </div>

    <FormLabel class="mt-6" :label="$t('sets.select_first_serve_team')" />
    <Dropdown
      class="easy-teams-selector-component"
      v-model="firstServeTeam"
      :options="[localTeam, visitorTeam]"
      optionLabel="name"
      :optionValue="team => team"
      scrollHeight="210px"
      :placeholder="$t('teams.select')"
      @update:modelValue="setFirstServeTeam"
    />

    <div class="flex justify-end mt-12">
      <Button
        type="submit"
        class="px-12"
        :label="$t('sets.start')"
        :disabled="
          !form.firstServeTeamId || !form.localTeamSide || !form.visitorTeamSide
        "
      />
    </div>
  </form>
</template>

<style scoped lang="scss">
.team-sides-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) min-content minmax(0, 1fr);
  align-items: center;

  .team {
    text-align: center;
    height: 3rem;
    border-radius: 0.5rem;
    background-color: var(--primary-color-light);
    padding: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .switch {
    height: 3rem;
    width: 3rem;
    padding: 0.65rem;
    font-size: 1.5rem;
    cursor: pointer;

    &:hover {
      color: var(--primary-color);
    }
  }
}
</style>
