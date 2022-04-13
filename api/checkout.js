const stripeAPI = require("./../stripe");

async function createCheckoutSession(request, response) {
	const domainUrl = process.env.WEB_APP_URL;
	const { line_items, customer_email } = request.body;
	console.log(line_items, customer_email);
	if (!line_items || !customer_email) {
		return response.status(400).json({ error: "missing required session parameters" });
	}
	let session;
	try {
		session = await stripeAPI.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items,
			customer_email,
			success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${domainUrl}/canceled`,
			shipping_address_collection: { allowed_countries: ["EG"] },
		});
		response.status(200).json({ sessionId: session.id });
	} catch (error) {
		console.log(error);
		response.status(400).json({ error: "an error occured unable to create session" });
	}
}
module.exports = createCheckoutSession;
