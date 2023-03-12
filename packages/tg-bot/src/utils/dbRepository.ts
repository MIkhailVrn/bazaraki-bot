import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { DateTime } from 'luxon'
import { BotUserRepository } from '../types'

const TABLE_NAME = 'bz-crawler-last-adv'

export const createBotUserRepository = (): BotUserRepository => {
  const client = new DynamoDBClient({})

  const save = async (id: number) => {
    await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall({ id }),
      })
    )
  }

  const get = async (id: number): Promise<number | null> => {
    const result = await client.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ id }),
      })
    )

    if (result.Item) {
      return unmarshall(result.Item).id
    }

    return null
  }

  const remove = async ({ key }: { key: string }) => {
    await client.send(
      new DeleteItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ key }),
      })
    )
  }

  return {
    get,
    save,
    remove,
  }
}
