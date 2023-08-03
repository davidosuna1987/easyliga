export type ApiCourt = {
  id: number
  sede_id: number
  name: string
  number: number
}

export type ApiCourtResponse = {
  success: boolean
  data: {
    courts: ApiCourt[]
  }
  errors: null
}
