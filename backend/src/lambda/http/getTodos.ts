import 'source-map-support/register'
import { getToken } from '../auth/auth0Authorizer'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import * as AWS  from 'aws-sdk'
import { decode } from 'jsonwebtoken'
// const docClient = new AWS.DynamoDB.DocumentClient()
// const todoTable = process.env.TODO_TABLE
import { getTODOPerUser } from '../../business-logic/todos-logic'
import { createLogger } from '../../utils/logger'


const logger = createLogger("getTodos")
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log(event)
  const jwtToken = getToken(event.headers['Authorization'])
  logger.info('new todo item', event);
  const userId = decode(jwtToken).sub
  console.log("Decoded userId: ", userId)

  const todo_items = await getTODOPerUser(userId)
  console.log(todo_items)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(event)
  }
  
}

// async function userExists(userId: string) {
//   const result = await docClient
//     .get({
//       TableName: todoTable,
//       Key: {
//         id: userId
//       }
//     })
//     .promise()

//   console.log('Get user: ', result)
//   return !!result.Item
// }

