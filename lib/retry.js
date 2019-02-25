const AWS = require("aws-sdk");
const sns = new AWS.SNS();
const restaurantRetryTopicArn = process.env.restaurant_retry_topic;
const cloudwatch = require("./cloudwatch");

let retryRestaurantNotification = async function(order) {
  let pubReq = {
    Message: JSON.stringify(order),
    TopicArn: restaurantRetryTopicArn
  };

  await cloudwatch.trackExecTime("SNSPublishLatency", () =>
    sns.publish(pubReq).promise()
  );

  // eslint-disable-next-line no-console
  console.log(`Order [${order.orderId}]: queued notification for retry.`);

  cloudwatch.incrCount("NotifyRestaurantQueued");
};

module.exports = {
  retryRestaurantNotification
};
