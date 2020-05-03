
const bucketName = process.env.IMAGES_S3_BUCKET
import * as AWS  from 'aws-sdk'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
import { getItems, deleteItem, getItem, putItem, updateItem } from '../data-layer/access-db'
import { TodoItem } from '../models/TodoItem';
import * as uuid from 'uuid'


const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export async function createTodo(userId: string, newTodo: CreateTodoRequest): Promise<TodoItem> {
  const timestamp = new Date().toISOString()
  const todoId = uuid.v4()
  const newItem = {
    todoId: todoId,
    userId: userId,
    createdAt: timestamp,
    done: false,
    ...newTodo
  }

  console.log('Storing new item: ', newItem)
  await putItem(newItem)
  return newItem
}

export async function getUploadUrl(todoId: string) {
  console.log("Calling getSignedUrl")
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}

export async function getTODOPerUser(userId: string) {
  console.log("Getting all todo items for this user")
  const result = await getItems(userId)
  return result
}

export async function deleteTodo(todoId, userId) {
  const item = await getItem(userId, todoId)
  console.log(item)
  await deleteItem(todoId, userId)
}
export async function updateTodo(updateTodo:UpdateTodoRequest, todoId, userId) {
  const item = await getItem(userId, todoId)
  console.log(item)
  await updateItem(todoId, userId, updateTodo)
}