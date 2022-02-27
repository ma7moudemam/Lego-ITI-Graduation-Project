const express = require("express");
const controller = require("../Controllers/orderController");
const router = express.Router();
const { body, query, param } = require("express-validator")

router.route("/order")
    .post(controller.setOrder)
    .get(controller.getOrder)
    .get(controller.getAllOrders)
    .put(controller.updateOrder)
    .delete(controller.deleteOrder);

module.exports = router;