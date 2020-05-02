
const bucketName = process.env.IMAGES_S3_BUCKET
import * as AWS  from 'aws-sdk'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
import { getItems } from '../data-layer/access-db'
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export async function createTodo(userId: string, todoId: string, newTodo: CreateTodoRequest) {
  const timestamp = new Date().toISOString()
  const newItem = {
    todoId: todoId,
    userId: userId,
    createdAt: timestamp,
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false,
    imageUrl: `https://${bucketName}/s3.amazonaws.com/${todoId}`
  }

  console.log('Storing new item: ', newItem)
  return newItem
}

export async function getUploadUrl(todoId: string) {
  console.log("Calling getSignedUrl")
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  }).promise()
}

export async function getTODOPerUser(userId: string) {
  console.log("Getting all todo items for this user")
  const result = getItems(userId)

  return result
}
