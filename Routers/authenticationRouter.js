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
		body("signup_email").isEmail().withMessage("Enter a Valid Email"),
		body("signup_password").isStrongPassword().withMessage("Please enter a Strong Password"),
		body("day").isInt().withMessage("Please Enter an integer number"),
		body("month").isInt().withMessage("Please Enter an integer number"),
		body("year").isInt().withMessage("Please Enter an integer number"),
		body("country").isString().withMessage("Must be a String"),
	],
	controller.register
);

module.exports = router;
