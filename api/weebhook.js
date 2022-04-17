const stripeAPI = require("./../stripe");
function webhook(request, response) {
	const sig = request.headers["stripe-signature"];
	let event;
	try {
		event = stripeAPI.webhooks.constructEvent(request["rawBody"], sig, process.env.WEB_HOOK_SECRET);
	} catch (error) {
		return response.status(400).send(`webhook error ${error.message}`);
	}
	if (event.type === "checkout.session.completed") {
		const session = event.data.object;
		console.log("Event data", session);

		//successful checkout data can be orders
	}
}
module.exports = webhook;
