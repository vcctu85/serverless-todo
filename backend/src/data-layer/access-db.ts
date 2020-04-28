import { create } from "domain"
const docClient = new AWS.DynamoDB.DocumentClient()
import * as AWS  from 'aws-sdk'
const todoTable = process.env.TODO_TABLE


export async function create(newItem) : Promise<TodoItem> {

    await docClient
        .put({
        TableName: todoTable,
        Item: newItem
        }).promise();

    return newItem;
}

export async function delete(todoId, userId) {
    await docClient.delete({
        TableName: todoTable,
        Key: {
          todoId: todoId,
          userId: userId
        }
      }).promise()
}