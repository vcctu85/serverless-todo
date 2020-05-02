const docClient = new AWS.DynamoDB.DocumentClient()
import * as AWS  from 'aws-sdk'
const todoTable = process.env.TODO_TABLE
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate'

export async function create(newItem) : Promise<TodoItem> {

    await docClient
        .put({
        TableName: todoTable,
        Item: newItem
        }).promise();

    return newItem;
}

export async function deleteItem(todoId, userId) {
    await docClient.delete({
        TableName: todoTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      }).promise()
}

export async function getItems(userId) : Promise<TodoItem[]> {
    const result = await docClient.query({
        TableName: todoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }).promise()

    return result.Items as TodoItem[]

}

export async function updateItem(updatedTodo, todoId) {
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
      
}

export async function setAttachmentUrl(todoId, userId, presignedUrl) {
    await docClient.update({
        TableName: todoTable,
        Key: {
          todoId,
          userId,
        },
        UpdateExpression: 'set presignedUrl = :presignedUrl',
        ExpressionAttributeValues: {
          ':presignedUrl': presignedUrl,
        },
      })
      .promise();
  }