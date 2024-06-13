import { Federation } from '@/domain/federation'
import { Club } from '@/domain/club'
import { Team } from '@/domain/team'
import { Profile } from '@/domain/profile'
import { ROLES, Role } from '@/domain/role'
import { ApiManagedModelMapped, ApiManagedModelsMapped } from '@/types/api/user'

export const VALID_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
]

export type LicensableModel = Federation | Club | Team | Profile

export const LICENSABLE_TYPE_MAPPER = {
  federation: 'federation',
  club: 'club',
  team: 'team',
  referee: 'referee',
  coach: 'coach',
  player: 'player',
} as const

export const LICENSABLE_TYPES = Object.values(LICENSABLE_TYPE_MAPPER)

export type LicensableType = (typeof LICENSABLE_TYPES)[number]

export const LICENSABLE_MODEL_TYPE_MAPPER = {
  federation: 'federation',
  club: 'club',
  team: 'team',
  referee: 'profile',
  coach: 'profile',
  player: 'profile',
} as const

export const LICENSABLE_MODEL_TYPES = Object.values(
  LICENSABLE_MODEL_TYPE_MAPPER,
)

export type LicensableModelType = (typeof LICENSABLE_MODEL_TYPES)[number]

export type LicensableModelMapped = {
  id: number
  name: string
  type: LicensableModelType
}

export type LicensableModels = Record<LicensableModelType, LicensableModel[]>

export type LicensableModelsMapped = Record<
  LicensableModelType,
  LicensableModelMapped[]
>

const LICENSABLE_EXCLUDED_ROLES = ['admin', 'staff', 'user'] as const

export type LicensableRole = Exclude<
  Role,
  (typeof LICENSABLE_EXCLUDED_ROLES)[number]
>

export const LICENSABLE_ROLES = ROLES.filter(
  role =>
    !LICENSABLE_EXCLUDED_ROLES.includes(
      role as (typeof LICENSABLE_EXCLUDED_ROLES)[number],
    ),
) as LicensableRole[]

export const mapRolesToLicensableRoles = (roles: Role[]): LicensableRole[] =>
  roles.filter(role =>
    LICENSABLE_ROLES.includes(role as LicensableRole),
  ) as LicensableRole[]

export const mapLicensableTypeToLicensableModelType = (
  type: LicensableType,
): LicensableModelType => {
  switch (type) {
    case 'federation':
      return 'federation'
    case 'club':
      return 'club'
    case 'team':
      return 'team'
    default:
      return 'profile'
  }
}

export const mapApiManagedModelMappedToLicensableModelMapped = (
  apiManagedModel: ApiManagedModelMapped,
): LicensableModelMapped => ({
  id: apiManagedModel.id,
  name: apiManagedModel.name,
  type: apiManagedModel.type as LicensableModelType,
})

// export const mapApiManagedModelToLicensableModel = (
//   apiManagedModel: ApiManagedModel,
//   apiManagedModelType: LicensableModelType,
// ): LicensableModel => {
//   switch (apiManagedModelType) {
//     case 'federation':
//       return mapApiFederationToFederation(apiManagedModel as ApiFederation)
//     case 'club':
//       return mapApiClubToClub(apiManagedModel as ApiClub)
//     case 'team':
//       return mapApiTeamToTeam(apiManagedModel as ApiTeam)
//     default:
//       return mapApiProfileToProfile(apiManagedModel as ApiProfile)
//   }
// }

export const mapApiManagedModelsMappedToLicensableModelsMapped = (
  apiManagedModelsMapped: ApiManagedModelsMapped,
): LicensableModelsMapped => {
  const licensableModelsMapped: LicensableModelsMapped =
    {} as LicensableModelsMapped

  for (const apiManagedModelType in apiManagedModelsMapped) {
    licensableModelsMapped[apiManagedModelType as LicensableModelType] =
      apiManagedModelsMapped[apiManagedModelType as LicensableModelType].map(
        mapApiManagedModelMappedToLicensableModelMapped,
      )
  }

  return licensableModelsMapped
}

export type LicensableModelMappedGrouped = {
  label: LicensableModelType
  items: LicensableModelMapped[]
}

export const mapMappedToLicensableModelsMappedToGroupedByTypeLicensableModelsMapped =
  (
    licensableModelsMapped?: LicensableModelsMapped,
  ): LicensableModelMappedGrouped[] => {
    const groupedLicensableModelsMapped: LicensableModelMappedGrouped[] = []

    for (const licensableModelType in licensableModelsMapped) {
      groupedLicensableModelsMapped.push({
        label: licensableModelType as LicensableModelType,
        items:
          licensableModelsMapped[licensableModelType as LicensableModelType],
      })
    }

    return groupedLicensableModelsMapped
  }

// export const mapLicensableByType = (
//   type: LicensableType,
//   apiLicensableModel: ApiLicensableModel,
// ): any => {
//   switch (type) {
//     case 'federation':
//       return mapApiFederationToFederation(apiLicensableModel as ApiFederation)
//     case 'club':
//       return mapApiClubToClub(apiLicensableModel as ApiClub)
//     case 'team':
//       return mapApiTeamToTeam(apiLicensableModel as ApiTeam)
//     default:
//       return mapApiProfileToProfile(apiLicensableModel as ApiProfile)
//   }
// }
