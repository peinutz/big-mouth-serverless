'use strict';

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// eslint-disable-next-line no-undef
const count = process.env.defaultResults || 8;
// eslint-disable-next-line no-undef
const tableName = process.env.restaurants_table;

async function getRestaurants(count) {
  let req = {
    TableName: tableName,
    Limit: count
  };

  let response = await dynamoDB.scan(req).promise();
  console.log("response: " + response);
  return response.Items;
}

// eslint-disable-next-line no-unused-vars
module.exports.handler = async (_event, _context) => {
  let restaurants = await getRestaurants(count);
  console.log(restaurants);

  return {
    "statusCode": 200,
    "body": JSON.stringify(restaurants)
  };

};