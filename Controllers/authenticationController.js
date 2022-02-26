const errorHandeler = require("./errorHandeler.js");
const bcrypt = require("bcrypt");
const userModel = require("./../Models/userModel.js");
const JWT = require("jsonwebtoken");

exports.login = (request, response, next) => {
	errorHandeler(request);
	userModel
		.findOne({ email: request.body.email })
		.then((data) => {
			if (data == null) {
				throw new Error("You are Not in our system Please Register");
			}
			if (bcrypt.compareSync(request.body.password, data.password)) {
				let token = JWT.sign(
					{
						email: request.body.email,
						role: "user",
					},
					process.env.SECRET_KEY,
					{ expiresIn: "2h" }
				);
				response.status(200).json({ message: `Welcome user`, data, token });
			} else throw new Error("UserName or Password is not Correct");
		})
		.catch((error) => next(error));
};

exports.register = (request, response, next) => {
	errorHandeler(request);
	userModel
		.findOne({ email: request.body.email })
		.then((data) => {
			if (data == null) response.redirect(307, "user");
			else {
				request.body.message = "You are Already a User";
				response.redirect(307, "login");
			}
		})
		.catch((error) => next(error));
};
