
const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis();
const sns = new AWS.SNS();
const streamName = process.env.order_events_stream;
const restaurantTopicArn = process.env.restaurant_notification_topic;
const chance = require('chance').Chance();

const { getRecords } = require('../lib/kinesis');

let notifyRestaurantOfOrder = async function(order) {

    if(chance.bool({likelihood: 75})) {
        throw new Error("Error for testing");
    }

    let pubReq = {
        Message: JSON.stringify(order),
        TopicArn: restaurantTopicArn
    }

    await sns.publish(pubReq).promise();

    console.log(`Notified restaurant [${order.restaurantName}] of order [${order.orderId}]`);

    let data = {...order};
    data.eventType = 'restaurant_notified'

    let putRecordReq = {
        Data: JSON.stringify(data),
        PartitionKey: data.orderId,
        StreamName: streamName
    }

    await kinesis.putRecord(putRecordReq);

    console.log(`published restaurant notified to kinesis`);
}

module.exports = {
    notifyRestaurantOfOrder
}