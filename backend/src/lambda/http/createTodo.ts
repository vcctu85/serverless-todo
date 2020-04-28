import 'source-map-support/register'

import * as uuid from 'uuid'
import { getToken } from '../auth/auth0Authorizer'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { decode } from 'jsonwebtoken'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import { createLogger } from '../../utils/logger'
import { createTodo } from '../../business-logic/todos-logic'


//const logger = createLogger("createTodo")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("EVENT:", event);
  const newTodo: CreateTodoRequest = JSON.parse(event['body'])
  const jwtToken = getToken(event.headers['Authorization'])
  // // TODO: Implement creating a new TODO item
  const userId = decode(jwtToken).sub
  const todoId = uuid.v4()
  
  console.log("Decode userId: ", userId)
  console.log("Creating todo item.")
  const newItem = await createTodo(userId, todoId, newTodo)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
         newItem
    })
  }
}



  
