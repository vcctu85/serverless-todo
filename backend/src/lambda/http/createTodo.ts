import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { decode } from 'jsonwebtoken'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE
//const bucketName = process.env.IMAGES_S3_BUCKET


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("EVENT:", event);
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  // TODO: Implement creating a new TODO item
  const userId = decode(jwtToken).sub
  const todoId = uuid.v4()
  //const authHeader = event.headers['Authorization']

  const newItem = await createTodo(userId, todoId, newTodo)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem: newItem
    })
  }
}


async function createTodo(userId: string, todoId: string, newTodo: CreateTodoRequest) {
  const timestamp = new Date().toISOString()
  const newItem = {
    userId,
    todoId,
    timestamp,
    ...newTodo,
    imageUrl: 'https://${bucketName}.s3.amazonaws.com/${todoId}'
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
