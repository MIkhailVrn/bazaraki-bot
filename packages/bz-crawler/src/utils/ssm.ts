import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

export const getValueSSM = async (Name: string) => {
  return await new SSMClient({}).send(
    new GetParameterCommand({
      Name,
      WithDecryption: true,
    })
  )
}
