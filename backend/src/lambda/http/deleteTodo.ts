import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    //const todoId = event.pathParameters.todoId
     console.log(event)
    // TODO: Remove a TODO item by id
    await docClient.delete({
      TableName: todoTable,
      Key: {
        todoId: '1',
        userId: 'vitu'
      }
    }).promise()

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "Deleted TODO item."
    }
}

