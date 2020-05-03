const docClient = new AWS.DynamoDB.DocumentClient()
import * as AWS  from 'aws-sdk'
const todoTable = process.env.TODO_TABLE
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate'

export async function putItem(newItem) : Promise<TodoItem> {

    await docClient
        .put({
        TableName: todoTable,
        Item: newItem
        }).promise();

    return newItem;
}

export async function deleteItem(todoId, userId) {
    const deletedItem = await docClient.delete({
        TableName: todoTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      }).promise();
    return deletedItem;
}

export async function getItem(userId, todoId) {
  const result = await docClient.query({
    TableName: todoTable,
    KeyConditionExpression: 'userId = :userId and todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': todoId,
      ':userId': userId
    }
  }).promise();
  return result.Items[0]
}

export async function getItems(userId){
    const result = await docClient.query({
        TableName: todoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }).promise();
    
    return result.Items

}

export async function updateItem(updatedTodo, todoId, userId) {
    await docClient.update({
        TableName: todoTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: 'set name=:x, dueDate=:y, done=:z',
        ExpressionAttributeValues: {
        ':x' : updatedTodo.name,
        ':y' : updatedTodo.dueDate,
        ':z' : updatedTodo.done,
        }
        
      }).promise();
      
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