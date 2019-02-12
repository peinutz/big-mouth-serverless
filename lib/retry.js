
const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const restaurantRetryTopicArn = process.env.restaurant_retry_topic;

let retryRestaurantNotification = async function(order) {
    let pubReq = {
        Message: JSON.stringify(order),
        TopicArn: restaurantRetryTopicArn
    }

    await sns.publish(pubReq).promise();

    console.log(`Order [${order.orderId}]: queued notification for retry.`);
}

module.exports = {
    retryRestaurantNotification
}