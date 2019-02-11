'use strict';

const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis();
const sns = new AWS.SNS();
const streamName = process.env.order_events_stream;
const topicArn = process.env.restaurant_notification_topic;

const { getRecords } = require('../lib/kinesis');


module.exports.handler = async (_event, _context) => {
    let records = getRecords(_event);

    let orderPlaced = records.filter(x => x.eventType === 'order_placed');

    for (let order of orderPlaced) {

        let pubReq = {
            Message: JSON.stringify(order),
            TopicArn: topicArn
        }

        await sns.publish(pubReq).promise();

        console.log(`Notified restaurant [${order.restaurantName}] of order [${order.orderId}]`);

        let data = _.clone(order);
        data.eventType = 'restaurant_notified'

        let putRecordReq = {
            Data: JSON.stringify(data),
            PartitionKey: data.orderId,
            StreamName: streamName
        }

        await kinesis.putRecord(putRecordReq);

        console.log(`published restaurant notified to kinesis`);

    }

    return {

    }
};