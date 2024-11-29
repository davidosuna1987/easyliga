import {
  CategoryDeepPartial,
  GameCustomAppendsDeepPartial,
  GameDeepPartial,
  GameRelationsDeepPartial,
} from 'domain/deep-partial'
import {
  ApiCategoryDeepPartial,
  ApiGameDeepPartial,
} from 'types/api/deep-partial'
import { mapApiLeagueToLeagueDeepPartial } from './league'
import {
  CategoryType,
  GameRelationsCount,
  mapApiGameStatisticsToGameStatistics,
} from 'domain/game'
import { mapApiDurationToDuration } from 'domain/utils'
import { mapApiDivisionToDivisionDeepPartial } from './division'

export const mapApiGameToGameDeepPartial = (
  apiGame: ApiGameDeepPartial,
): GameDeepPartial => ({
  id: apiGame.id ?? undefined,
  leagueId: apiGame.league_id ?? undefined,
  divisionId: apiGame.division_id ?? undefined,
  clubId: apiGame.club_id ?? undefined,
  sedeId: apiGame.sede_id ?? undefined,
  courtId: apiGame.court_id ?? undefined,
  refereeId: apiGame.referee_id ?? undefined,
  localTeamId: apiGame.local_team_id ?? undefined,
  visitorTeamId: apiGame.visitor_team_id ?? undefined,
  winnerTeamId: apiGame.winner_team_id ?? undefined,
  loserTeamId: apiGame.loser_team_id ?? undefined,
  date: apiGame.date ?? undefined,
  dateConfirmedBy: apiGame.date_confirmed_by ?? undefined,
  requestedDate: apiGame.requested_date ?? undefined,
  dateRequestedBy: apiGame.date_requested_by ?? undefined,
  matchday: apiGame.matchday ?? undefined,
  start: apiGame.start ?? undefined,
  end: apiGame.end ?? undefined,
  status: apiGame.status ?? undefined,
  observations: apiGame.observations ?? undefined,
  resultsAssignedManuallyBy: apiGame.results_assigned_manually_by ?? undefined,

  ...mapApiGameRelationsToGameRelationsDeepPartial(apiGame),
  ...mapApiGameRelationsCountToGameRelationsCountDeepPartial(apiGame),
  ...mapApiGameCustomAppendsToGameCustomAppendsDeepPartial(apiGame),
})

export const mapApiGameRelationsToGameRelationsDeepPartial = (
  apiGame: ApiGameDeepPartial,
): GameRelationsDeepPartial => ({
  league: apiGame.league
    ? mapApiLeagueToLeagueDeepPartial(apiGame.league)
    : undefined,
  division: apiGame.division
    ? mapApiDivisionToDivisionDeepPartial(apiGame.division)
    : undefined,
  club: apiGame.club ? mapApiClubToClubDeepPartial(apiGame.club) : undefined,
  sede: apiGame.sede ? mapApiSedeToSedeDeepPartial(apiGame.sede) : undefined,
  court: apiGame.court
    ? mapApiCourtToCourtDeepPartial(apiGame.court)
    : undefined,
  referee: apiGame.referee
    ? mapApiUserToUserDeepPartial(apiGame.referee)
    : undefined,
  localTeam: apiGame.local_team
    ? mapApiTeamToTeamDeepPartial(apiGame.local_team)
    : undefined,
  visitorTeam: apiGame.visitor_team
    ? mapApiTeamToTeamDeepPartial(apiGame.visitor_team)
    : undefined,
  winnerTeam: apiGame.winner_team
    ? mapApiTeamToTeamDeepPartial(apiGame.winner_team)
    : undefined,
  loserTeam: apiGame.loser_team
    ? mapApiTeamToTeamDeepPartial(apiGame.loser_team)
    : undefined,
  teams: apiGame.teams?.map(team => mapApiTeamToTeamDeepPartial(team, false)),
  calls: apiGame.calls?.map(mapApiCallToCall),
  sets: apiGame.sets?.map(mapApiSetToSet),
  currentSet: apiGame.current_set
    ? mapApiSetToSetDeepPartial(apiGame.current_set)
    : undefined,
  sanctions: apiGame.sanctions
    ? apiGame.sanctions.map(mapApiSanctionToSanction)
    : undefined,
  injuries: apiGame.injuries
    ? apiGame.injuries.map(mapApiInjuryToInjury)
    : undefined,
  signatures: apiGame.signatures
    ? apiGame.signatures.map(mapApiGameSignatureToGameSignature)
    : undefined,
  resultAssignee: apiGame.result_assignee
    ? mapApiUserToUserDeepPartial(apiGame.result_assignee)
    : undefined,
})

export const mapApiGameRelationsCountToGameRelationsCountDeepPartial = (
  apiGame: ApiGameDeepPartial,
): GameRelationsCount => ({
  localTeamSetsWonCount: apiGame.local_team_sets_won_count,
  visitorTeamSetsWonCount: apiGame.visitor_team_sets_won_count,
})

export const mapApiGameCustomAppendsToGameCustomAppendsDeepPartial = (
  apiGame: ApiGameDeepPartial,
): GameCustomAppendsDeepPartial => ({
  name: apiGame.name ?? undefined,
  teamNames: apiGame.team_names
    ? mapApiTeamNamesToTeamNamesDeepPartial(apiGame.team_names)
    : undefined,
  duration: apiGame.duration
    ? mapApiDurationToDuration(apiGame.duration)
    : undefined,
  confirmed: apiGame.confirmed ?? undefined,
  isBye: apiGame.is_bye ?? undefined,
  statistics: apiGame.statistics
    ? mapApiGameStatisticsToGameStatistics(apiGame.statistics)
    : undefined,
})

export const mapApiCategoryToCategoryDeepPartial = (
  apiCategory: ApiCategoryDeepPartial,
): CategoryDeepPartial => ({
  id: apiCategory.id ?? undefined,
  name: (apiCategory.name as CategoryType) ?? undefined,
})
