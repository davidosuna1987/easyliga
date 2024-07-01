<script setup lang="ts">
import { Team } from '@/domain/team'
import { SetSide, SetStartRequest } from '@/domain/set'
import { IconNames } from '@/domain/icon'

const props = defineProps({
  leftSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  rightSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
})

const emit = defineEmits(['set:start'])

const { t } = useI18n()

const form = ref<SetStartRequest>({
  localTeamSide: SetSide.LEFT,
  visitorTeamSide: SetSide.RIGHT,
  firstServeTeamId: 0,
})
const firstServeTeam = ref<Team>()

const leftSideTeam = computed(() => {
  return form.value.localTeamSide === SetSide.LEFT
    ? props.leftSideTeam
    : props.rightSideTeam
})

const rightSideTeam = computed(() => {
  return form.value.localTeamSide === SetSide.RIGHT
    ? props.leftSideTeam
    : props.rightSideTeam
})

const switchTeamSides = () => {
  const localTeamSide = form.value.localTeamSide
  const visitorTeamSide = form.value.visitorTeamSide

  form.value.localTeamSide = visitorTeamSide
  form.value.visitorTeamSide = localTeamSide
}

const setFirstServeTeam = () => {
  if (!firstServeTeam.value) return
  form.value.firstServeTeamId = firstServeTeam.value?.id
}
</script>

<template>
  <form
    class="easy-set-start-form-component"
    @submit.prevent="emit('set:start', form)"
  >
    <FormLabel :label="t('sets.select_team_sides')" />
    <div class="team-sides-container">
      <div class="team">
        {{ leftSideTeam.name }}
      </div>
      <Icon :name="IconNames.refresh" class="switch" @click="switchTeamSides" />
      <div class="team">
        {{ rightSideTeam.name }}
      </div>
    </div>

    <FormLabel class="mt-6" :label="t('sets.select_first_serve_team')" />
    <Dropdown
      class="easy-teams-selector-component w-full"
      v-model="firstServeTeam"
      :options="[leftSideTeam, rightSideTeam]"
      optionLabel="name"
      :optionValue="team => team"
      scrollHeight="210px"
      :placeholder="t('teams.select')"
      @update:modelValue="setFirstServeTeam"
    />

    <div class="flex justify-end mt-12">
      <Button
        type="submit"
        class="px-12"
        :label="t('sets.start')"
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

<script lang="ts">
export default {
  name: 'SetStartForm',
}
</script>
