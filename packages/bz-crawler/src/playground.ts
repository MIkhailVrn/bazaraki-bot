import { APIGatewayEvent } from 'aws-lambda'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { sendTelegramCommand } from './tg/messages'
import { createLastAdvRepository } from './utils'
import { DateTime } from 'luxon'
;(async (event: APIGatewayEvent) => {
  let lastAdvTime = DateTime.now().setZone('Europe/Nicosia')

  const lastAdvRepository = createLastAdvRepository()

  const lastAdvISO = await lastAdvRepository.get()

  const response = await fetch(
    'https://www.bazaraki.com/car-motorbikes-boats-and-parts/cars-trucks-and-vans/?price_max=10000'
  )
  const body = await response.text()
  const $ = cheerio.load(body)
  const adsContainerList = $('.announcement-container')
  const advTime = DateTime.now().setZone('Europe/Nicosia')
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
      console.log(formattedAdvTime.toISO(), ' > ', lastAdvTime.toISO())
      await lastAdvRepository.save(advTime)
      await sendTelegramCommand('sendMessage', {
        chat_id: 148580023,
        text: 'https://www.bazaraki.com' + link,
      })
    }
  }
  // @ts-ignore
})({})
