import { APIGatewayEvent } from 'aws-lambda'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { sendTelegramCommand } from './tg/messages'
import { createBotUsersRepository, createLastAdvRepository } from './utils'
import { DateTime } from 'luxon'
import { BotUsersRepository } from './types'

export const handler = async (event: APIGatewayEvent) => {
  let lastAdvTime = DateTime.now().setZone('Europe/Nicosia')

  const lastAdvRepository = createLastAdvRepository()

  const lastAdvISO = await lastAdvRepository.get()

  if (lastAdvISO) {
    lastAdvTime = DateTime.fromISO(lastAdvISO)
  } else {
    await lastAdvRepository.save(lastAdvTime)
  }

  const response = await fetch(
    'https://www.bazaraki.com/car-motorbikes-boats-and-parts/cars-trucks-and-vans/?price_max=10000'
  )
  const body = await response.text()
  const $ = cheerio.load(body)
  const adsContainerList = $('.announcement-container')
  const advTime = DateTime.now().setZone('Europe/Nicosia')

  let botUserRepository: BotUsersRepository

  for (let i = 0; i < adsContainerList.length; i++) {
    const link = $(adsContainerList[i]).find('[itemprop="url"]').attr('href')

    const dateStr = $(adsContainerList[i])
      .find('.announcement-block__date')
      .text()
    if (!dateStr?.includes('Today')) {
      continue
    }

    const date = dateStr?.match(/\b\d\d:\d\d\b/)
    console.log('date adv = ', date[0])
    const timeStr = date && date[0]
    const [hours, minutes] = timeStr?.split(':')
    const formattedAdvTime = advTime.set({
      hour: Number(hours),
      minute: Number(minutes),
      second: 0,
      millisecond: 0,
    })

    if (formattedAdvTime > lastAdvTime) {
      if (!botUserRepository) {
        botUserRepository = createBotUsersRepository()
      }
      const users = await botUserRepository.getAll()
      console.log(formattedAdvTime.toISO(), ' > ', lastAdvTime.toISO())

      // they go from top to bottom. prevent saving not the latest
      const lastStoredInDbISO = await lastAdvRepository.get()
      if (DateTime.fromISO(lastStoredInDbISO) < formattedAdvTime) {
        await lastAdvRepository.save(formattedAdvTime)
      }

      for (let user of users) {
        await sendTelegramCommand('sendMessage', {
          chat_id: user,
          text: 'https://www.bazaraki.com' + link,
        })
      }
    }
  }
}
