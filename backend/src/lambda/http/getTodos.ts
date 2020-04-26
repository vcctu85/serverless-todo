import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
// import { decode } from 'jsonwebtoken'
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log(event)
  // const authorization = event.headers.Authorization
  // const split = authorization.split(' ')
  // const jwtToken = split[1]
  // // TODO: Implement creating a new TODO item
  // // .sub or .sub.payload?
  // const userId = decode(jwtToken).sub
  const validGroupId = await userExists("vitu")
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
  const todo_items = await getTODOPerUser("vitu")
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
  const result = await docClient
    .get({
      TableName: todoTable,
      Key: {
        id: userId
      }
    })
    .promise()

  console.log('Get user: ', result)
  return !!result.Item
}


async function getTODOPerUser(userId: string) {
  const result = await docClient.query({
    TableName: todoTable,
    //todo
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()

  return result.Items
}
