import { getValueSSM } from '../utils'

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
    throw new Error(res)
  }
  const result = await res.json()
  if (!result.ok) {
    throw new Error(result.description)
  }
  return result.result
}
