import { APIGatewayEvent } from 'aws-lambda'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { sendTelegramCommand } from './tg/messages'
import { createLastAdvRepository } from './utils'

export const handler = async (event: APIGatewayEvent) => {
  let lastAdvTime = new Date()

  const lastAdvRepository = createLastAdvRepository()

  const lastAdv = await lastAdvRepository.get()

  if (lastAdv) {
    lastAdvTime = new Date(lastAdv)
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
    const advTime = new Date()
    advTime.setHours(parseInt(hours))
    advTime.setMinutes(parseInt(minutes))
    advTime.setSeconds(0)
    advTime.setMilliseconds(0)

    if (advTime > lastAdvTime) {
      await lastAdvRepository.save(advTime)
      await sendTelegramCommand('sendMessage', {
        chat_id: 148580023,
        text: 'https://www.bazaraki.com' + link,
      })
    }
  }
}
