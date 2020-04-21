import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE
const userTable = process.env.USER_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user

  const userId = event.pathParameters.userId
  const validUserId = await userExists(userId)

  if (!validUserId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'User does not exist in table'
      })
    }
  }

  const todo_items = await getTODOPerUser(userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todo_items
    })
  }
  
}

async function userExists(userId: string) {
  const result = await docClient
    .get({
      TableName: userTable,
      Key: {
        id: userId
      }
    })
    .promise()

  console.log('Get user: ', result)
  return !!result.Item
}

async function getTODOPerUser(groupId: string) {
  const result = await docClient.query({
    TableName: todoTable,
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  }).promise()

  return result.Items
}
