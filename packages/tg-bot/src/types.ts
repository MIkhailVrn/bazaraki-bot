export type SendCommandParams = SendTextParams | SendSetWebhookParams

export type SendTextParams = {
  chat_id: number
  text: string
}

export type SendSetWebhookParams = {
  url: string
}

export type BotUserRecord = {
  id: number
  date: string
}

export type BotUserRepository = {
  get: (id: number) => Promise<number | null>
  save: (id: number) => Promise<void>
  remove: ({ key }: { key: string }) => Promise<void>
}
