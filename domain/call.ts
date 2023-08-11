import { ApiCall, ApiCallPlayersData } from '@/types/api/call'
import { Player } from '@/domain/game'

export type CallPlayerData = {
  profileId: number
  firstName: string
  lastName: string | null
  avatar: string | null
  shirtNumber: number
  captain: boolean
  libero: boolean
}

export type Call = {
  id: number
  playersData: CallPlayerData[]
  locked: boolean
}

export const mapCallPlayersDataToPlayers = (
  callPlayersData: CallPlayerData[],
): Player[] => {
  return callPlayersData.map(callPlayerData => {
    return {
      profileId: callPlayerData.profileId,
      firstName: callPlayerData.firstName,
      lastName: callPlayerData.lastName,
      shirtNumber: callPlayerData.shirtNumber,
      avatar: callPlayerData.avatar,
      captain: callPlayerData.captain,
      libero: callPlayerData.libero,
    }
  })
}

export const mapApiCallPlayersDataToCallPlayersData = (
  apiCallPlayersData: ApiCallPlayersData[],
): CallPlayerData[] => {
  return apiCallPlayersData.map(apiCallPlayerData => {
    return {
      profileId: apiCallPlayerData.profile_id,
      firstName: apiCallPlayerData.first_name,
      lastName: apiCallPlayerData.last_name,
      avatar: apiCallPlayerData.avatar,
      shirtNumber: apiCallPlayerData.shirt_number,
      captain: apiCallPlayerData.captain,
      libero: apiCallPlayerData.libero,
    }
  })
}

export const mapApiCallToCall = (apiCall: ApiCall): Call => {
  return {
    id: apiCall.id,
    playersData: mapApiCallPlayersDataToCallPlayersData(apiCall.players_data),
    locked: apiCall.locked,
  }
}

export const getProfileIdsFromCallPlayersData = (
  callPlayersData: CallPlayerData[],
) => callPlayersData.map(callPlayerData => callPlayerData.profileId)

export const getCaptainIdFromCallPlayersData = (
  callPlayersData: CallPlayerData[],
) => callPlayersData.find(p => p.captain)?.profileId ?? 0

export const getLiberoIdFromCallPlayersData = (
  callPlayersData: CallPlayerData[],
) => callPlayersData.find(p => p.libero)?.profileId ?? 0
