"use strict";

const AWS = require("aws-sdk");
const kinesis = new AWS.Kinesis();
const streamName = process.env.order_events_stream;
const chance = require("chance").Chance();
const log = require("../lib/log");
const middy = require("middy");
const sampleLogging = require("../middleware/sample-logging");
const flushMetrics = require("../middleware/flush-metrics");

// eslint-disable-next-line no-unused-vars
const handler = async (_event, _context) => {
  let restaurantName = JSON.parse(_event.body).restaurantName;
  log.debug("Request body is a valid JSON", { requestBody: _event.body });

  let userEmail = _event.requestContext.authorizer.claims.email;

  let orderId = chance.guid();

  log.debug("placing order", { orderId, restaurantName, userEmail });

  let data = {
    orderId,
    userEmail,
    restaurantName,
    eventType: "order_placed"
  };

  let putReq = {
    Data: JSON.stringify(data),
    PartitionKey: orderId,
    StreamName: streamName
  };

  await kinesis.putRecord(putReq).promise();

  log.debug("published  event to kinesis", { eventName: "order_placed" });

  return {
    statusCode: 200,
    body: JSON.stringify({ orderId })
  };
};

module.exports.handler = middy(handler)
  .use(sampleLogging({ sampleRate: 1 }))
  .use(flushMetrics);
