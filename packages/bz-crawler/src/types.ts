export type SendCommandParams = SendTextParams | SendSetWebhookParams

export type SendTextParams = {
  chat_id: number
  text: string
}

export type SendSetWebhookParams = {
  url: string
}
