import { getValueSSM } from '../utils'
import fetch from 'node-fetch'
import { SendCommandParams } from '../types'

export const sendTelegramCommand = async (
  url: string,
  params: SendCommandParams
) => {
  const token = (await getValueSSM('bot-token')).Parameter.Value

  const res = await fetch(`https://api.telegram.org/bot${token}/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
  if (!res.ok) {
    throw new Error('Error')
  }
}
