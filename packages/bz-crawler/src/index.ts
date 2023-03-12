import { APIGatewayEvent } from 'aws-lambda'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { sendTelegramCommand } from './tg/messages'
import { createLastAdvRepository } from './utils'
import { DateTime } from 'luxon'

export const handler = async (event: APIGatewayEvent) => {
  let lastAdvTime = DateTime.now()

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
  for (let i = 0; i < adsContainerList.length; i++) {
    const link = $(adsContainerList[i]).find('[itemprop="url"]').attr('href')

    const dateStr = $(adsContainerList[i])
      .find('.announcement-block__date')
      .text()
    if (!dateStr?.includes('Today')) {
      continue
    }
    const date = dateStr?.match(/\b\d\d:\d\d\b/)
    const timeStr = date && date[0]
    const [hours, minutes] = timeStr?.split(':')
    const advTime = DateTime.now().setZone('Europe/Nicosia')
    advTime.set({ hour: Number(hours), minute: Number(minutes) })

    if (advTime > lastAdvTime) {
      await lastAdvRepository.save(advTime)
      await sendTelegramCommand('sendMessage', {
        chat_id: 148580023,
        text: 'https://www.bazaraki.com' + link,
      })
    }
  }
}
