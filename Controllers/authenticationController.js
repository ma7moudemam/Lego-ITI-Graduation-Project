const errorHandeler = require("./errorHandeler.js");
const bcrypt = require("bcrypt");
const userModel = require("./../Models/userModel.js");
const shipperModel = require("./../Models/shippersModel");
const JWT = require("jsonwebtoken");
const refreshTokens = require("./../refreshTokens");

function createAccessToken(email, role, user) {
	let token = JWT.sign(
		{
			email: email,
			role: role,
			user: user,
		},
		process.env.SECRET_KEY,
		{ expiresIn: "15m" }
	);
	return token;
}
function createRefreshToken(email, role, user) {
	let token = JWT.sign(
		{
			email: email,
			role: role,
			user: user,
		},
		process.env.REFRESH_SECRET_KEY
	);
	return token;
}

exports.login = (request, response, next) => {
	errorHandeler(request);
	if (request.body.email == process.env.ADMIN_EMAIL && request.body.password == process.env.ADMIN_PASSWORD) {
		let token = JWT.sign(
			{
				email: request.body.email,
				role: request.body.role,
			},
			process.env.SECRET_KEY
		);
		let refreshToken = JWT.sign(
			{
				email: request.body.email,
				role: request.body.role,
			},
			process.env.REFRESH_SECRET_KEY
		);
		refreshTokens.push(refreshToken);
		return response.status(200).json({ message: "welcome admin", token, refreshToken });
	} else {
		userModel
			.findOne({ email: request.body.email })
			.then((data) => {
				if (data == null) {
					shipperModel
						.findOne({ email: request.body.email })
						.then((data) => {
							if (data == null) {
								return response.status(400).json({ message: "You are not in the system Go Out" });
							}
							if (bcrypt.compareSync(request.body.password, data.password)) {
								let token = createAccessToken(request.body.email, "shipper", data);
								let refreshToken = createRefreshToken(request.body.email, "shipper", data);
								refreshTokens.push(refreshToken);
								return response.status(200).json({ message: "welcome Shipper", token, refreshToken });
							} else {
								return response.status(400).json({ message: "Email or Password is incorrect" });
							}
						})
						.catch((error) => next(error));
				}
				if (bcrypt.compareSync(request.body.password, data.password)) {
					let token = createAccessToken(request.body.email, "user", data);
					let refreshToken = createRefreshToken(request.body.email, "user", data);
					refreshTokens.push(refreshToken);
					return response.status(200).json({ message: `You Logged in Successfully`, token, refreshToken });
				} else response.status(400).json({ message: "Email or Password is incorrect" });
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
					userName: request.body.signup_username,
					password: hashedPassword,
					age: getAge(),
					country: request.body.country,
					address: {
						city: request.body.city,
						street: request.body.street,
						building: request.body.building,
					},
					wishlist: [],
					blocked: false,
				});
				object
					.save()
					.then((data) => response.status(200).json({ message: "You signed up successfully" }))
					.catch((error) => response.status(400).json({ message: "Error occured try again later" }));
			} else {
				return response.status(400).json({ message: "You are Already a User" });
			}
		})
		.catch((error) => next(error));
};
