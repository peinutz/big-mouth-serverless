"use strict";

const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const mustache = require("mustache");
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
// eslint-disable-next-line no-undef
const restaurantsApiRoot = process.env.restaurants_api;
const axios = require("axios");
const aws4 = require("aws4");
const URL = require("url");

// eslint-disable-next-line no-undef
const awsRegion = process.env.AWS_REGION;
// eslint-disable-next-line no-undef
const cognitoUserPoolId = process.env.cognito_user_pool_id;
const cognitoClientId = process.env.cognito_client_id;

var html;

async function loadHTML() {
  if (!html) {
    html = await fs.readFileAsync("static/index.html", "utf-8");
  }

  return html;
}

async function getRestaurants() {
  let url = URL.parse(restaurantsApiRoot);
  let opts = {
    host: url.hostname,
    path: url.pathname
  };

  aws4.sign(opts);

  let headers = {
    headers: {
      Host: opts.headers["Host"],
      "X-Amz-Date": opts.headers["Host"],
      Authorization: opts.headers["Authorization"],
      "X-Amz-Security-Token": opts.headers["X-Amz-Security-Token"]
    }
  };

  var restaurants = await axios.get(restaurantsApiRoot, headers);

  return restaurants.data;
}

// eslint-disable-next-line no-unused-vars
module.exports.handler = async (_event, _context) => {
  let template = await loadHTML();
  let restaurants = await getRestaurants();
  console.log(restaurants);
  let dayOfWeek = daysOfWeek[new Date().getDay()];

  let view = {
    dayOfWeek,
    restaurants,
    awsRegion,
    cognitoUserPoolId,
    cognitoClientId,
    searchUrl: `${restaurantsApiRoot}`
  };

  let html = mustache.render(template, view);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8"
    },
    body: html
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
