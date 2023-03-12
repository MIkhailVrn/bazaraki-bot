import { APIGatewayEvent } from 'aws-lambda'
import { sendTelegramCommand } from './tg/messages'
import { setWebhook } from './utils'

export const handler = async (event: APIGatewayEvent) => {
  // @ts-ignore
  if (event.setWebhook) {
    await setWebhook()
  } else {
    const update = JSON.parse(event.body)
    const {
      message: {
        chat: { id: chat_id },
        text,
      },
    } = update
    await sendTelegramCommand('sendMessage', {
      chat_id,
      text,
    })
  }
}
