const Payment = require("../Models/paymentModel");
const errorHandeler = require("./errorHandeler");

exports.getPayment = function (request, response, next) {
	if (request.email) {
		Payment.find({ user: request.email })
			.then((data) => {
				if (data == null) throw new Error("No Payment");
				response.status(200).json(data);
			})
			.catch((error) => next(error));
	}
};

exports.createPayment = function (request, response, next) {
	if (request.role == "user") {
		errorHandeler(request);
		Payment.findOne({ card_number: request.body.card_number }).then((data) => {
			if (data == null) {
				let payment = new Payment({
					user: request.email,
					card_number: request.body.card_number,
					exp_year: request.body.exp_year,
					exp_month: request.body.exp_month,
					CVV: request.body.CVV,
				});
				payment
					.save()
					.then((data) => {
						response.status(200).json(data);
					})
					.catch((error) => next(error));
			} else {
				throw new Error("Already Exists");
			}
		});
	} else {
		throw new Error("Not Authorized");
	}
};

exports.deletePayment = function (request, response, next) {
	if (request.role == "user" && request.email) {
		Payment.deleteOne({ card_number: request.body.card_number })
			.then((data) => {
				response.status(200).json(data);
			})
			.catch((error) => next(error));
	}
};
