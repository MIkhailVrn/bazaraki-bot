import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { DateTime } from 'luxon'
import { LastAdvRepository, LAST_ADV_RECORD_ID } from '../types'

const TABLE_NAME = 'bz-crawler-last-adv'

export const createLastAdvRepository = (): LastAdvRepository => {
  const client = new DynamoDBClient({})

  const save = async (date: DateTime) => {
    await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall({ id: LAST_ADV_RECORD_ID, date: date.toISO() }),
      })
    )
  }

  const get = async (): Promise<string | null> => {
    const result = await client.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
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
