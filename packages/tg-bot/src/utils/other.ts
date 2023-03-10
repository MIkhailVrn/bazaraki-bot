import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'
import { sendTelegramCommand } from '../tg/messages'

export const getValueSSM = async (Name: string) => {
  return await new SSMClient({}).send(
    new GetParameterCommand({
      Name,
      WithDecryption: true,
    })
  )
}

export const setWebhook = async () => {
  const { DOMAIN, PATH_KEY } = process.env
  await sendTelegramCommand('setWebhook', {
    url: `${DOMAIN}/${PATH_KEY}/`,
  })
}
