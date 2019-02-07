"use strict";

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// eslint-disable-next-line no-undef
const count = process.env.defaultResults || 8;
// eslint-disable-next-line no-undef
const tableName = process.env.restaurants_table;

async function findRestaurantsByTheme(theme, count) {
  let req = {
    TableName: tableName,
    Limit: count,
    FilterExpression: "contains(themes, :theme)",
    ExpressionAttributeValues : {":theme" : theme }
  };

  let response = await dynamoDB.scan(req).promise();

  return response.Items;
}

// eslint-disable-next-line no-unused-vars
module.exports.handler = async (_event, _context) => {
  let req = JSON.parse(_event.body);
  let restaurants = await findRestaurantsByTheme(req.theme, count);


  return {
    statusCode: 200,
    body: JSON.stringify(restaurants)
  };
};
