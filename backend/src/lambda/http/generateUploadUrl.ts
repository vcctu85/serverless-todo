import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUploadUrl} from '../../business-logic/todos-logic'



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event['pathParameters']['todoId']
  console.log(todoId)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const presignedUrl = getUploadUrl(todoId)
  console.log("Generated preSignedUrl: ", presignedUrl)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      url_string: presignedUrl
    })
  }
}


