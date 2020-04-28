import 'source-map-support/register'
import { getToken } from '../auth/auth0Authorizer'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { decode } from 'jsonwebtoken'
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE
import { getTODOPerUser } from '../../business-logic/todos-logic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log(event)
  const jwtToken = getToken(event.headers['Authorization'])

  const userId = decode(jwtToken).sub
  console.log("Decoded userId: ", userId)
  const validGroupId = await userExists(userId)
  if (!validGroupId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'User does not exist'
      })
    }
  }
  const todo_items = await getTODOPerUser(userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      todo_items
    })
  }
  
}

async function userExists(userId: string) {
  console.log("Checking if user exists in table")
  const result = await docClient
    .get({
      TableName: todoTable,
      Key: {
        userId: userId
      }
    }).promise()

  console.log('Get user: ', result)
  return !!result.Item
}

