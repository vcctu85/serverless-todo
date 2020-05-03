import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getToken } from '../auth/auth0Authorizer'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateItem } from '../../data-layer/access-db'
import { decode } from 'jsonwebtoken'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event['pathParameters']['todoId']
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  console.log("TodoId: ", todoId)
  console.log("Updating TODO")
  const jwtToken = getToken(event.headers['Authorization'])
  const userId = decode(jwtToken).sub
  const newTodo = updateItem(updatedTodo, todoId, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newTodo
 })
  }
}
