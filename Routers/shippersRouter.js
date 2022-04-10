const express = require("express");
const controller = require("../Controllers/shippersController");
const router = express.Router();
const { body, query, param } = require("express-validator")

router.route("/shippers")
    .post([
        body("name").isString().withMessage("name is required"),
        body("email").isString().withMessage("email is required"),
        body("password").isString().withMessage("password is required"),
        body("contact").isArray().withMessage("contact is required"),
    ],controller.setShipper)
    .get(controller.getShipper)
    .get(controller.getAllShippers)
    .put(controller.updateShipper)
    .delete(controller.deleteShipper);

module.exports = router;