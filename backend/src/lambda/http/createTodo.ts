import 'source-map-support/register'


import { getToken } from '../auth/auth0Authorizer'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { decode } from 'jsonwebtoken'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../business-logic/todos-logic'


const logger = createLogger("createTodo")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("EVENT:", event);
  logger.info('new todo item', event);
  const newTodo: CreateTodoRequest = JSON.parse(event['body'])
  const jwtToken = getToken(event.headers['Authorization'])
  // // TODO: Implement creating a new TODO item
  const userId = decode(jwtToken).sub
  
  
  console.log("Decode userId: ", userId)
  console.log("Creating todo item.")
  logger.info('auth user id', userId)
  logger.info('processing event: ', event)
  const newItem = await createTodo(userId, newTodo)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}



  
