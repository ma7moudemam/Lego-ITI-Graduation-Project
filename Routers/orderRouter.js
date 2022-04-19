const express = require("express");
const controller = require("../Controllers/orderController");
const router = express.Router();
const { body, query, param } = require("express-validator");
const isAuth = require("./../middelWare/auth");

router
	.route("/order")
	.post(
		[
			body("user").isString().withMessage("user is required"),
			body("order_date").isString().withMessage("order_date is required"),
			body("product").isArray().withMessage("product is required"),
		],
		controller.addOrder
	)
	.get(controller.getOrder)
	.get(controller.getAllOrders)
	.put(controller.updateOrder)
	.delete(controller.deleteOrder);


router.route("/userOrder")
    .get( isAuth, controller.getUserOrder);
	
module.exports = router;
