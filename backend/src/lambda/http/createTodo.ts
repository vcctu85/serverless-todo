import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item

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
  const todoId = uuid.v4()
  const newItem = await createTodo(userId, todoId, newTodo)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem: newItem
    })
  }

  //return undefined
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

async function createTodo(userId: string, todoId: string, newTodo: CreateTodoRequest) {
  const timestamp = new Date().toISOString()
  const newItem = {
    todoId,
    timestamp,
    ...newTodo,
    false
  }
  console.log('Storing new item: ', newItem)

  await docClient
    .put({
      TableName: todoTable,
      Item: newItem
    })
    .promise()

  return newItem
}
