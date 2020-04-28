import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE
import { decode } from 'jsonwebtoken'
import { getToken } from '../auth/auth0Authorizer'
import { delete } from '../../data-layer/access-db'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
     console.log(event)
     const jwtToken = getToken(event.headers['Authorization'])
     const userId = decode(jwtToken).sub
    // TODO: Remove a TODO item by id
    console.log("Decoded userId: ", userId)
    console.log("Deleting todo item.")

    delete(todoId, userId)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "Deleted TODO item."
    }
}

