const express = require("express");
const controller = require("../Controllers/orderController");
const router = express.Router();
const { body, query, param } = require("express-validator");
const isAuth = require("./../middelWare/auth");

router
	.route("/order")
	.post(
		[
			body("user").isInt().withMessage("user is required"),
			body("products").isArray().withMessage("product is required"),
		],
		controller.addOrder
	)
	.get(controller.getOrder)
	// .get(controller.getAllOrders)
	.put(controller.updateOrder)
	.delete(controller.deleteOrder);

router.route("/orders/")
	.get(controller.getOrder)
router.route("/userOrder")
	.get(isAuth, controller.getUserOrder);

module.exports = router;
