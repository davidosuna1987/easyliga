<script setup lang="ts">
import FederationService from '@/services/federation'
import LeagueService from '@/services/league'
import {
  Federation,
  groupFederationsById,
  mapApiFederationToFederation,
} from '@/domain/federation'
import { Category, Gender } from '@/domain/game'
import { League, mapApiLeagueToLeague } from '@/domain/league'

const emit = defineEmits<{
  (e: 'league:selected', value: League | undefined): void
}>()

const { t } = useI18n()

const federationService = new FederationService()
const leagueService = new LeagueService()

const dropdownFederations = ref<Federation[]>([])

const selectableFederations = ref<Federation[]>([])
const selectableCategories = ref<Category[]>([])
const selectableGenders = ref<Gender[]>([])
const selectableLeagues = ref<League[]>([])

const selectedFederation = ref<Federation>()
const selectedCategory = ref<Category>()
const selectedGender = ref<Gender>()
const selectedLeague = ref<League>()

const hiddenFederationIds = ref<number[]>([])
const hiddenCategoryIds = ref<number[]>([])
const hiddenGenderIds = ref<number[]>([])

const loadingApi = ref<boolean>(false)

const filteredLeagues = computed(() =>
  selectedFederation.value?.leagues?.filter(
    league =>
      league.categoryId === selectedCategory.value?.id &&
      league.genderId === selectedGender.value?.id,
  ),
)

const showFederationSelector = computed(
  () => true /* selectableFederations.value.length > 1, */,
)

const selectInputMessage = computed(() => {
  if (!selectedFederation.value) return t('federations.select')
  if (!selectedCategory.value) return t('categories.select')
  if (!selectedGender.value) return t('genders.select')
  return
})

const getFederations = async () => {
  loadingApi.value = true
  const { data } = await federationService.fetch({ with: 'leagues' })

  const federations = data.value?.data.federations.map(
    mapApiFederationToFederation,
  )

  dropdownFederations.value = groupFederationsById(federations ?? [])

  setSelectableFederations(federations ?? [])

  loadingApi.value = false
}

const getLeagues = async () => {
  if (
    !selectedFederation.value ||
    !selectedCategory.value ||
    !selectedGender.value
  )
    return

  loadingApi.value = true

  const { data } = await leagueService.fetch({
    where: [
      `federation_id:${selectedFederation.value?.id}`,
      `category_id:${selectedCategory.value?.id}`,
      `gender_id:${selectedGender.value?.id}`,
    ].join(','),
  })
  const leagues = data.value?.data.leagues.map(mapApiLeagueToLeague)
  setSelectableLeagues(leagues ?? [])

  loadingApi.value = false
}

const setSelectableFederations = (federations: Federation[]) => {
  const isSelectableFederation = (federation: Federation): boolean =>
    !!federation.leagues?.length

  selectableFederations.value = federations.filter(isSelectableFederation)
  setHiddenFederations(federations)
}

const setSelectableCategories = (categories: Category[]) => {
  selectableCategories.value = categories
  setHiddenCategories()
}

const setSelectableGenders = (genders: Gender[]) => {
  selectableGenders.value = genders
  setHiddenGenders()
}

const setSelectableLeagues = (leagues: League[]) => {
  selectableLeagues.value = leagues
  setSelectedLeagueIfOnlyOneSelectable()
}

const setHiddenFederations = (federations: Federation[]) => {
  const federationsFederationIds = federations.map(
    federation => federation.federationId,
  )

  const isHiddenFederation = (federation: Federation): boolean =>
    !federation.leagues?.length &&
    !federationsFederationIds.includes(federation.id)

  hiddenFederationIds.value = federations
    .filter(isHiddenFederation)
    .map(federation => federation.id)
}

const setHiddenCategories = () => {
  const selectedFederationLeagueCategoryIds =
    selectedFederation.value?.leagues
      ?.map(league => league.categoryId)
      .filter((id): id is number => id !== undefined) ?? []

  const isHiddenCategory = (category: Category): boolean =>
    !selectedFederationLeagueCategoryIds.includes(category.id)

  hiddenCategoryIds.value = selectableCategories.value
    .filter(isHiddenCategory)
    .map(category => category.id)
}

const setHiddenGenders = () => {
  const selectedFederationLeagueGenderIds =
    selectedFederation.value?.leagues
      ?.filter(league => league.categoryId === selectedCategory.value?.id)
      ?.map(league => league.genderId)
      .filter((id): id is number => id !== undefined) ?? []

  const isHiddenGender = (gender: Gender): boolean =>
    !selectedFederationLeagueGenderIds.includes(gender.id)

  hiddenGenderIds.value = selectableGenders.value
    .filter(isHiddenGender)
    .map(gender => gender.id)
}

const setSelectedFederation = (federation?: Federation) => {
  if (selectedFederation.value?.id === federation?.id) return
  selectedFederation.value = federation
  setHiddenCategories()
  setSelectedLeague()
  getLeagues()
}

const setSelectedCategory = (category?: Category) => {
  if (selectedCategory.value?.id === category?.id) return
  selectedCategory.value = category
  setHiddenGenders()
  setSelectedLeague()
  getLeagues()
}

const setSelectedGender = (gender?: Gender) => {
  if (selectedGender.value?.id === gender?.id) return
  selectedGender.value = gender
  setSelectedLeague()
  getLeagues()
}

const setSelectedLeague = (league?: League) => {
  if (selectedLeague.value?.id === league?.id) return
  selectedLeague.value = league
  emit('league:selected', league)
}

const setSelectedLeagueIfOnlyOneSelectable = () => {
  if (filteredLeagues.value?.length === 1) {
    setSelectedLeague(filteredLeagues.value[0])
  }
}

onMounted(getFederations)
</script>

<template>
  <div class="easy-web-league-selector-component">
    <LoadingLabel v-if="false" :label="t('leagues.loading')" center />
    <EasyGrid v-else :cols="12" :gap="3">
      <FederationSelector
        v-show="showFederationSelector"
        :federations="dropdownFederations"
        :hiddenFederationIds="hiddenFederationIds"
        @federation:selected="setSelectedFederation"
      />
      <CategorySelector
        :disabled="!selectedFederation"
        :hiddenCategoryIds="hiddenCategoryIds"
        @category:fetch="setSelectableCategories"
        @category:selected="setSelectedCategory"
      />
      <GenderSelector
        :disabled="!selectedFederation || !selectedCategory"
        :hiddenGenderIds="hiddenGenderIds"
        @gender:fetch="setSelectableGenders"
        @gender:selected="setSelectedGender"
      />
      <Dropdown
        class="easy-league-selector-component"
        v-model="selectedLeague"
        :disabled="!selectedFederation || !selectedCategory || !selectedGender"
        :loading="loadingApi"
        :options="filteredLeagues"
        optionLabel="nameLong"
        scrollHeight="210px"
        :placeholder="t('leagues.select')"
        @update:modelValue="setSelectedLeague"
      />
    </EasyGrid>
    <p v-if="selectInputMessage" class="mt-5">{{ selectInputMessage }}</p>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/common/breakpoints.scss';

.easy-web-league-selector-component {
  max-width: 850px;
  margin-inline: auto;
}

.easy-federations-selector-component {
  grid-column: 1 / 13;
}
.easy-categories-selector-component {
  grid-column: 1 / 13;
}
.easy-genders-selector-component {
  grid-column: 1 / 13;
}
.easy-league-selector-component {
  grid-column: 1 / 13;
}

@media (min-width: $media-xs) {
  .easy-federations-selector-component {
    grid-column: 1 / 13;
  }
  .easy-categories-selector-component {
    grid-column: 1 / 7;
  }
  .easy-genders-selector-component {
    grid-column: 7 / 13;
  }
  .easy-league-selector-component {
    grid-column: 1 / 13;
  }
}

@media (min-width: $media-sm) {
  .easy-categories-selector-component,
  .easy-genders-selector-component {
    min-width: 280px;
  }
}

@media (min-width: $media-ml) {
  .easy-federations-selector-component {
    grid-column: 1/ 5;
  }
  .easy-categories-selector-component {
    grid-column: 5 / 9;
    min-width: none;
  }
  .easy-genders-selector-component {
    grid-column: 9 / 13;
    min-width: none;
  }
  .easy-league-selector-component {
    grid-column: 1 / 13;
  }
}
</style>

<script lang="ts">
export default {
  name: 'WebLeagueSelector',
}
</script>
