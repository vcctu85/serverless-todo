import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user

  const userId = event.pathParameters.userId

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


async function getTODOPerUser(userId: string) {
  const result = await docClient.query({
    TableName: todoTable,
    //todo
    IndexName: 'index-name',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      userId: userId
    }
  }).promise()

  return result.Items
}
