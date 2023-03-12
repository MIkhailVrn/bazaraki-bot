import { DateTime } from 'luxon'

export type SendCommandParams = SendTextParams | SendSetWebhookParams

export type SendTextParams = {
  chat_id: number
  text: string
}

export type SendSetWebhookParams = {
  url: string
}

export const LAST_ADV_RECORD_ID = '1'

export type LastAdvRecord = {
  id: typeof LAST_ADV_RECORD_ID
  date: string
}

export type LastAdvRepository = {
  get: () => Promise<string | null>
  save: (date: DateTime) => Promise<void>
  remove: ({ key }: { key: string }) => Promise<void>
}

export type BotUsersRepository = {
  getAll: () => Promise<number[] | undefined>
}
