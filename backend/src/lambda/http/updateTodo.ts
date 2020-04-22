import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS  from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  await docClient.update({
    TableName: todoTable,
    Key: {
      todoId: todoId,
    },
    UpdateExpression: 'set name=:x, dueDate=:y, done=:z',
    ExpressionAttributeValues: {
    ':x' : updatedTodo.name,
    ':y' : updatedTodo.dueDate,
    ':z' : updatedTodo.done,
    }
    
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ""
  }
}
