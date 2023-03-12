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
