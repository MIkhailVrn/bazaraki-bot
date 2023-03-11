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

export const handler = async () => {
  console.log('lol')
}
