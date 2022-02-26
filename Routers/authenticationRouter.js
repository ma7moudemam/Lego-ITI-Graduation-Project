const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const controller = require("./../Controllers/authenticationController.js");

router.post(
	"/login",
	[
		body("email").isEmail().withMessage("Enter a Valid E-mail"),
		body("password").isStrongPassword().withMessage("Enter A strong Password"),
	],
	controller.login
);

router.post(
	"/register",
	[
		body("email").isEmail().withMessage("Enter a Valid Email"),
		body("password").isStrongPassword().withMessage("Please enter a Strong Password"),
		body("age").isInt().withMessage("Please Enter an integer number"),
		body("country").isString().withMessage("Must be a String"),
		body("city").isString().withMessage("Please Enter A City"),
		body("street").isString().withMessage("Please Enter A Street"),
		body("building").isInt().withMessage("Please Enter A Number"),
	],
	controller.register
);

module.exports = router;
