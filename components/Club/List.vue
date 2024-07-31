<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import ClubService from '@/services/club'
import { Club, mapApiClubToClub } from '@/domain/club'

const props = defineProps({
  clubs: {
    type: Array as PropType<Club[]>,
    required: false,
  },
  loadingLabel: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  noManagedText: {
    type: String,
    required: false,
  },
  hoverable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'club:create', value: boolean): void
}>()

const { t } = useI18n()
const auth = useAuthStore()
const clubService = new ClubService()

const clubs = ref<Club[]>()
const loadingApi = ref<boolean>(false)

const heading = computed(() => props.title ?? t('clubs.list'))
const noManaged = computed(() => props.noManagedText ?? t('clubs.no_managed'))

const getClubs = async () => {
  if (props.clubs) {
    clubs.value = props.clubs
    return
  }

  if (!auth.user) return

  loadingApi.value = true
  const { data } = await clubService.fetch({
    where: `responsible_id:${auth.user.id}`,
    with_count: 'teams',
  })

  clubs.value = data.value?.data.clubs.map(mapApiClubToClub)

  loadingApi.value = false
}

const goToEditClub = (club: Club) => {
  navigateTo(`/clubs/${club.id}/edit`)
}

const teamsCount = (club: Club) =>
  club.teams ? club.teams.length : club.teamsCount ?? 0

onMounted(getClubs)
</script>

<template>
  <div class="easy-club-list-component">
    <header class="header flex justify-between items-center">
      <Heading tag="h6" position="center">{{ heading }}</Heading>
      <Button
        class="action"
        :label="t('clubs.add')"
        size="small"
        @click.prevent="emit('club:create', true)"
      />
    </header>
    <template v-if="loadingApi">
      <LoadingLabel v-if="loadingLabel" :label="loadingLabel" />
      <Loading v-else />
    </template>
    <template v-else>
      <List v-if="clubs?.length">
        <ListItem v-for="club in clubs" :hoverable="hoverable">
          <p>{{ club.name }}</p>

          <template #actions>
            <ListActionLabel>
              {{
                t(
                  'teams.count',
                  { num: teamsCount(club) },
                  teamsCount(club) ?? 0,
                )
              }}
            </ListActionLabel>
            <ListActionButton
              :label="t('forms.edit')"
              severity="info"
              outlined
              :onClick="() => goToEditClub(club)"
            />
          </template>
        </ListItem>
      </List>
      <p v-else>{{ noManaged }}</p>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ClubList',
}
</script>
