import { APIGatewayEvent } from 'aws-lambda'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { sendTelegramCommand } from './tg/messages'

export const handler = async (event: APIGatewayEvent) => {
  let lastAdsTime = new Date()
  lastAdsTime.setHours(10)

  const response = await fetch(
    'https://www.bazaraki.com/car-motorbikes-boats-and-parts/cars-trucks-and-vans/?price_max=10000'
  )
  const body = await response.text()
  const $ = cheerio.load(body)
  const adsContainerList = $('.announcement-container')
  let isNewAds = false
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
    const adsTime = new Date()
    adsTime.setHours(parseInt(hours))
    adsTime.setMinutes(parseInt(minutes))
    adsTime.setSeconds(0)
    adsTime.setMilliseconds(0)

    if (adsTime > lastAdsTime) {
      isNewAds = true
      lastAdsTime = adsTime
      await sendTelegramCommand('sendMessage', {
        chat_id: 148580023,
        text: 'https://www.bazaraki.com' + link,
      })
    }
  }
}
