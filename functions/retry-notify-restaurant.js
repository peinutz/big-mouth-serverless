const notify = require('../lib/notify');

module.exports.handler = async function(event, context, callback) {
	let order = JSON.parse(event.Records[0].Sns.Message);
	order.retried = true;

	try {
		await notify.notifyRestaurantOfOrder(order);
		callback(null, 'alldone')
	} catch (err) {
		console.log("error")
		callback(err);
	}
};
