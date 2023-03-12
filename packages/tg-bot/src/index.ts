import { APIGatewayEvent } from 'aws-lambda'
import { sendTelegramCommand } from './tg/messages'
import { setWebhook } from './utils'
import { createBotUserRepository } from './utils/dbRepository'

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

    if (text === '/start') {
      const repository = createBotUserRepository()
      repository.save(chat_id)
    }
    await sendTelegramCommand('sendMessage', {
      chat_id,
      text: 'You will now receive updates from Bazaraki.com',
    })
  }
}
