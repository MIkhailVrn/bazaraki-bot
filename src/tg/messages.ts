import { getValueSSM } from '../utils'
import fetch from 'node-fetch'

// @ts-ignore
export const sendTelegramCommand = async (url: string, params) => {
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
  const result = await res.json()
  // @ts-ignore
  if (!result.ok) {
    // @ts-ignore
    throw new Error(result.description)
  }
  // @ts-ignore
  return result.result
}
