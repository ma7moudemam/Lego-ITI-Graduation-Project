const errorHandeler = require("./errorHandeler.js");
const bcrypt = require("bcrypt");
const userModel = require("./../Models/userModel.js");
const shipperModel = require("./../Models/shippersModel");
const JWT = require("jsonwebtoken");

exports.login = (request, response, next) => {
	errorHandeler(request);
	if (
		request.body.signup_email == process.env.ADMIN_EMAIL &&
		request.body.signup_password == process.env.ADMIN_PASSWORD
	) {
		let token = JWT.sign(
			{
				email: request.body.signup_email,
				role: "admin",
			},
			process.env.SECRET_KEY,
			{ expiresIn: "2h" }
		);
		response.status(200).json({ message: "welcome admin", token });
	} else {
		userModel
			.findOne({ email: request.body.signup_email })
			.then((data) => {
				if (data == null) {
					shipperModel
						.findOne({ email: request.body.signup_email })
						.then((data) => {
							if (data == null) {
								throw new Error("You are not in the system Go Out");
							}
							if (bcrypt.compareSync(request.body.signup_password, data.password)) {
								let token = JWT.sign(
									{
										email: request.body.signup_email,
										role: "shipper",
									},
									process.env.SECRET_KEY,
									{ expiresIn: "2h" }
								);
								response.status(200).json({ message: "welcome Shipper", data, token });
							} else {
								throw new Error("Email or Password is not Correct");
							}
						})
						.catch((error) => next(error));
				}
				if (bcrypt.compareSync(request.body.signup_password, data.password)) {
					let token = JWT.sign(
						{
							email: request.body.signup_email,
							role: "user",
						},
						process.env.SECRET_KEY,
						{ expiresIn: "2h" }
					);
					response.status(200).json({ message: `Welcome user`, data, token });
				} else throw new Error("Email or Password is not Correct");
			})
			.catch((error) => next(error));
	}
};

exports.register = (request, response, next) => {
	errorHandeler(request);
	userModel
		.findOne({ email: request.body.signup_email })
		.then((data) => {
			if (data == null) response.redirect(307, "account");
			else {
				throw new Error("You are Already a User");
			}
		})
		.catch((error) => next(error));
};
