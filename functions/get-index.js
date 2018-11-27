'use strict';

const Promise = require("bluebird")
const fs = Promise.promisifyAll(require('fs'));

var html;

async function loadHTML() {
  if (!html) {
    html = await fs.readFileAsync('static/index.html', "utf-8");
    console.log("there is no html")
  }
  console.log("there is htnl")
  return html;
}

module.exports.handler = async (event, context) => {
  console.log("function started/n");
  html = await loadHTML();
  console.log("after load/n");
  return {
    "statusCode": 200,
    "headers": {
      "Content-Type": "text/html; charset=UTF-8"
    },
    "body": html,

  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};