const notify = require("../lib/notify");
const log = require("../lib/log");
// const middy = require("middy");
// const sampleLogging = require("../middleware/sample-logging");
// const flushMetrics = require("../middleware/flush-metrics");

const handler = async function(event, context, callback) {
  let order = JSON.parse(event.Records[0].Sns.Message);
  order.retried = true;

  let logContext = {
    orderId: order.orderId,
    restaurantName: order.restaurantName,
    userEmail: order.userEmail,
    retry: true
  };

  try {
    await notify.notifyRestaurantOfOrder(order);
    callback(null, "alldone");
  } catch (err) {
    log.warn("failed to notify restaurant of new order", logContext, err);
    callback(err);
  }
};

module.exports.handler = handler;
