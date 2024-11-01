export type ApiEmailCustomRequest = {
  destinataries: string[]
  subject: string
  greeting: string
  message: string
  action_url: string | null
  action_text: string | null
  attachments: string[]
}

export type ApiEmailTemplate = {
  key: string
  name?: string
  description?: string
  greeting?: string
  message?: string
  variables?: ApiEmailTemplateVariables[]
  attachments?: string[]
  massive?: boolean
}

export type ApiEmailTemplateVariables = {
  key: string
  name?: string
  type?: ApiEmailTemplateType
  model?: boolean
  value?: ApiEmailTemplateVariablesValue
  required?: boolean
}

export type ApiEmailTemplateType = 'text' | 'number' | 'date' | 'email'

export type ApiEmailTemplateVariablesValue =
  | string
  | number
  | Date
  | string[]
  | number[]
  | Date[]
