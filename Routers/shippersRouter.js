const express = require("express");
const controller = require("../Controllers/shippersController");
const router = express.Router();
const { body, query, param } = require("express-validator")

router.route("/shippers")
    .post(controller.setShipper)
    .get(controller.getShipper)
    .get(controller.getAllShippers)
    .put(controller.updateShipper)
    .delete(controller.deleteShipper);

module.exports = router;