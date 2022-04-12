const errorHandeler = require("./errorHandeler.js");
const bcrypt = require("bcrypt");
const userModel = require("./../Models/userModel.js");
const shipperModel = require("./../Models/shippersModel");
const JWT = require("jsonwebtoken");

exports.login = (request, response, next) => {
	errorHandeler(request);
	if (request.body.email == process.env.ADMIN_EMAIL && request.body.password == process.env.ADMIN_PASSWORD) {
		let token = JWT.sign(
			{
				email: request.body.email,
				role: "admin",
			},
			process.env.SECRET_KEY,
			{ expiresIn: "2h" }
		);
		response.status(200).json({ message: "welcome admin", token });
	} else {
		userModel
			.findOne({ email: request.body.email })
			.then((data) => {
				if (data == null) {
					shipperModel
						.findOne({ email: request.body.email })
						.then((data) => {
							if (data == null) {
								throw new Error("You are not in the system Go Out");
							}
							if (bcrypt.compareSync(request.body.password, data.password)) {
								let token = JWT.sign(
									{
										email: request.body.email,
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
				if (bcrypt.compareSync(request.body.password, data.password)) {
					let token = JWT.sign(
						{
							user: data,
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
			if (data == null) {
				errorHandeler(request);
				let hashedPassword = bcrypt.hashSync(request.body.signup_password, 15);
				function getAge() {
					var today = new Date();
					var birthDate = new Date(`${request.body.year}/${request.body.month}/${request.body.day}`);
					var age = today.getFullYear() - birthDate.getFullYear();
					var m = today.getMonth() - birthDate.getMonth();
					if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
						age--;
					}
					return age;
				}
				let object = new userModel({
					email: request.body.signup_email,
					password: hashedPassword,
					userName: request.body.userName,
					age: getAge(),
					country: request.body.country,
					address: {
						city: request.body.city,
						street: request.body.street,
						building: request.body.building,
					},
					wishlist: [],
				});
				object
					.save()
					.then((data) => response.status(200).json({ data }))
					.catch((error) => next(error));
			} else {
				throw new Error("You are Already a User");
			}
		})
		.catch((error) => next(error));
};
