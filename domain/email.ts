import { ApiEmailCustomRequest } from '@/types/api/email'

export const EMAIL_DEFAULT_DATA = {
  destinataries: [],
  subject: 'Hola',
  greeting: '👋 ¡Hola!',
  message: '',
  actionUrl: '',
  actionText: '',
  attachments: [],
}

export type EmailCustomRequest = {
  destinataries: string[]
  subject: string
  greeting: string
  message: string
  actionUrl?: string
  actionText?: string
  attachments: string[]
}

export type EmailTemplate = {
  key: string
  name?: string
  description?: string
  greeting?: string
  message?: string
  variables?: EmailTemplateVariables[]
  attachments?: string[]
  massive?: boolean
}

export type EmailTemplateVariables = {
  key: string
  name?: string
  type?: EmailTemplateType
  model?: boolean
  value?: EmailTemplateVariablesValue
  required?: boolean
}

export type EmailTemplateType = 'text' | 'number' | 'date' | 'email'

export type EmailTemplateVariablesValue =
  | string
  | number
  | Date
  | string[]
  | number[]
  | Date[]

export const mapEmailCustomRequestToApiEmailCustomRequest = (
  request: EmailCustomRequest,
): ApiEmailCustomRequest => ({
  destinataries: request.destinataries,
  subject: request.subject,
  greeting: request.greeting,
  message: request.message,
  action_url: request.actionUrl ?? null,
  action_text: request.actionText ?? null,
  attachments: request.attachments,
})

export const mapEmailTemplateToApiEmailTemplate = (
  emailTemplate: EmailTemplate,
): EmailTemplate => ({
  key: emailTemplate.key,
  name: emailTemplate.name,
  description: emailTemplate.description,
  greeting: emailTemplate.greeting,
  message: emailTemplate.message,
  variables: emailTemplate.variables,
  attachments: emailTemplate.attachments,
  massive: emailTemplate.massive,
})

export const toHtml = (
  message: string,
  variables?: EmailTemplateVariables[],
) => {
  if (!variables || !variables.length) return message

  variables.forEach(variable => {
    if (variable.key && variable.value)
      message = message?.replaceAll(
        `{{${variable.key}}}`,
        variable.value as string,
      )
  })

  return message
}
