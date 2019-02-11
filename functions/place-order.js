'use strict';

const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis();
const streamName = process.env.order_events_stream;
const chance = require('chance').Chance();

module.exports.handler = async (_event, _context) => {
	let restaurantName = JSON.parse(_event.body).restaurantName;

	let userEmail = _event.requestContext.authorizer.claims.email;

	let orderId = chance.guid();

    console.log(`Placing [${orderId}] to [${restaurantName}] from user [${userEmail}]`);

    let data = {
        orderId,
        userEmail,
        restaurantName,
        eventType: 'order_placed'
    }
    
    let putReq = {
        Data: JSON.stringify(data),
        PartitionKey: orderId,
        StreamName: streamName
    }

    await kinesis.putRecord(putReq).promise();

    console.log('published order_placed event to kinesis');

    return {
        statusCode: 200,
        body: JSON.stringify({ orderId })
    }
};
