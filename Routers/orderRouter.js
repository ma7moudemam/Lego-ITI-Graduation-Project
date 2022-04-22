const express = require("express");
const controller = require("../Controllers/orderController");
const router = express.Router();
const { body, query, param } = require("express-validator");
const isAuth = require("./../middelWare/auth");

router
	.route("/order")
	.post(controller.addOrder)
	.get(controller.getOrder)
	// .get(controller.getAllOrders)

	.delete(controller.deleteOrder);

router.route("/orders/")
	.get(controller.getOrder);
router.route("/userOrder")
	.get(isAuth, controller.getUserOrder)
	.post(controller.updateOrder);

router.route("/shipper/orders").post(controller.findShippersOrders);

module.exports = router;
