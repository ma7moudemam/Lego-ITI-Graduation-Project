const express = require("express");
const controller = require("../Controllers/paymentController");
const isAuthorized = require("../middelWare/auth");
const router = express.Router();
const { body, query, param } = require("express-validator");

router
	.route("/payment")
	.get(isAuthorized, controller.getPayment)
	.post(
		isAuthorized,
		[
			body("card_number").isInt({ min: 16, max: 16 }).withMessage("card number must be digits"),
			body("exp_year").isInt({ min: 2, max: 2 }).withMessage("YY"),
			body("exp_month").isInt({ min: 2, max: 2 }).withMessage("MM"),
			body("CVV").isInt({ min: 3, max: 3 }).withMessage("CVV must be 3 digits"),
		],
		controller.createPayment
	)
	.delete(isAuthorized, controller.deletePayment);

module.exports = router;
