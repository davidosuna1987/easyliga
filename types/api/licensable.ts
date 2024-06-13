import { ApiClub } from '@/types/api/club'
import { ApiFederation } from '@/types/api/federation'
import { ApiProfile } from '@/types/api/profile'
import { ApiTeam } from '@/types/api/team'

export type ApiLicensableModel = ApiFederation | ApiClub | ApiTeam | ApiProfile
