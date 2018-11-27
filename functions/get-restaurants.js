'use strict'
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const count = process.env.defaultResults || 8;
const tableName = process.env.restaurants_table;

async function getRestaurants(count) {
  let req = {
    TableName: tableName,
    Limit: count
  }

  let response = await dynamoDB.scan(req).promise()
  console.log("response: " + response)
  return response.Items
}

module.exports.handler = async (evnet, context) => {
  let restaurants = await getRestaurants(count);
  console.log(restaurants);

  return {
    "statusCode": 200,
    "body": restaurants
  }

}