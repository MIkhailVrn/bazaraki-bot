import { APIGatewayEvent } from 'aws-lambda'
import { sendTelegramCommand } from './tg/messages'

/* import TelegramBot from 'node-telegram-bot-api'
import { config } from 'dotenv'

config()

const token = process.env.BOT_TOKEN

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true })

// Matches "/echo [whatever]"
bot.on('message', (msg, match) => {
  bot.sendMessage(process.env.MY_USER, 'https://www.bazaraki.com')
}) */

export const handler = async (event: APIGatewayEvent) => {
  // @ts-ignore
  if (event.setWebhook) {
    const { DOMAIN, PATH_KEY } = process.env
    await sendTelegramCommand('setWebhook', {
      url: `${DOMAIN}/${PATH_KEY}/`,
    })
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
