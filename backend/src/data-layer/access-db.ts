import { create } from "domain"
const docClient = new AWS.DynamoDB.DocumentClient()
import * as AWS  from 'aws-sdk'
const todoTable = process.env.TODO_TABLE
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoItem'

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
          todoId: todoId,
          userId: userId
        }
      }).promise()
}

export async function getItems(userId) : Promise<> {
    const items = await docClient.query({
        TableName: todoTable,
        //todo
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }).promise()
    return items

}

export async function updateItem(updatedTodo, todoId) : Promise<TodoUpdate> {
    const todo = await docClient.update({
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
      
      return todo
}