"use strict";

const notify = require("../lib/notify");
const retry = require("../lib/retry");

const { getRecords } = require("../lib/kinesis");

module.exports.handler = async (_event, _context) => {
  let records = getRecords(_event);

  let orderPlaced = records.filter(x => x.eventType === "order_placed");

  for (let order of orderPlaced) {
    try {
      await notify.notifyRestaurantOfOrder(order);
    } catch (err) {
      await retry.retryRestaurantNotification(order);
    }
  }

  return {};
};
