export type ApiFederation = {
  id: number
  federation_id?: number
  resposnsible_id?: number
  address_id?: number
  name: string
  short_name?: string
  scope?: string
  slug: string
  email?: string
  phone?: string
  website?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

export type ApiFederationResponse = {
  success: boolean
  data: {
    federations: ApiFederation[]
  }
  errors: null
}
