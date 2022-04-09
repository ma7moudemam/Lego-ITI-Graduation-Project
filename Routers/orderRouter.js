const express = require("express");
const controller = require("../Controllers/orderController");
const router = express.Router();
const { body, query, param } = require("express-validator");

router
	.route("/order")
	.post([
		body("user").isString().withMessage("user is required"),
		body("shipper").isInt().withMessage("shipper is required"),
		body("order_status").isInt().withMessage("order_status is required"),
		body("tax").isInt().withMessage("tax is required"),
		body("payment").isInt().withMessage("payment is required"),
		body("order_date").isString().withMessage("order_date is required"),
		body("product").isArray().withMessage("product is required"),
	],controller.addOrder)
	.get(controller.getOrder)
	.get(controller.getAllOrders)
	.put(controller.updateOrder)
	.delete(controller.deleteOrder);

module.exports = router;
