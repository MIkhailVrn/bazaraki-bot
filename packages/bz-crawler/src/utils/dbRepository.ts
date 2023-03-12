import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  ScanCommandOutput,
  ScanCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { DateTime } from 'luxon'
import {
  BotUsersRepository,
  LastAdvRepository,
  LAST_ADV_RECORD_ID,
} from '../types'

const LAST_ADV_TABLE_NAME = 'bz-crawler-last-adv'

export const createLastAdvRepository = (): LastAdvRepository => {
  const client = new DynamoDBClient({})

  const save = async (date: DateTime) => {
    await client.send(
      new PutItemCommand({
        TableName: LAST_ADV_TABLE_NAME,
        Item: marshall({ id: LAST_ADV_RECORD_ID, date: date.toISO() }),
      })
    )
  }

  const get = async (): Promise<string | null> => {
    const result = await client.send(
      new GetItemCommand({
        TableName: LAST_ADV_TABLE_NAME,
        Key: marshall({ id: LAST_ADV_RECORD_ID }),
      })
    )

    if (result.Item) {
      return unmarshall(result.Item).date
    }

    return null
  }

  const remove = async ({ key }: { key: string }) => {
    await client.send(
      new DeleteItemCommand({
        TableName: LAST_ADV_TABLE_NAME,
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

const BOT_USERS_TABLE_NAME = 'tg-bot-users'
export const createBotUsersRepository = (): BotUsersRepository => {
  const client = new DynamoDBClient({})

  const getAll = async (): Promise<number[] | undefined> => {
    // eslint-disable-next-line no-undef-init
    let ExclusiveStartKey = undefined
    const items = []
    do {
      // eslint-disable-next-line no-await-in-loop
      const result: ScanCommandOutput = await client.send(
        new ScanCommand({
          TableName: BOT_USERS_TABLE_NAME,
          ExclusiveStartKey,
        })
      )
      ExclusiveStartKey = result.LastEvaluatedKey
      if (result.Items) {
        items.push(...result.Items)
      }
    } while (typeof ExclusiveStartKey !== 'undefined')

    return items.map((item) => unmarshall(item).id)
  }

  return {
    getAll,
  }
}
