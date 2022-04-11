const errorHandeler = require("./errorHandeler.js");
const UserModel = require("./../Models/userModel");
const bcrypt = require("bcrypt");

exports.postUser = (req, res, next) => {
	errorHandeler(req);
	let hashedPassword = bcrypt.hashSync(req.body.signup_password, 15);
	function getAge() {
		var today = new Date();
		var birthDate = new Date(`${req.body.year}/${req.body.month}/${req.body.day}`);
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}
	let object = new UserModel({
		email: req.body.signup_email,
		password: hashedPassword,
		userName: req.body.userName,
		age: getAge(),
		country: req.body.country,
		address: {
			city: req.body.city,
			street: req.body.street,
			building: req.body.building,
		},
		wishlist: [],
	});
	object
		.save()
		.then((data) => res.status(200).json({ data }))
		.catch((error) => next(error));
};

// Get User-Profile
exports.getProfile = (req, res, next) => {
	errorHandeler(req);
	if (req.role == "user") {
		res.status(200).json(req.user);
	} else {
		throw new Error("Not Authorized.");
	}
};

// Update User-Profile
exports.updateProfile = (req, res, next) => {
	console.log("back end");
	console.log(req.body);
	// errorHandeler(req);
	// Case => update not valid keys
	const updates = Object.keys(req.body);
	const allwoedUpdates = [
		"userName",
		"email",
		"password",
		"year",
		"month",
		"day",
		"age",
		"address",
		"country",
		"street",
		"city",
		"building",
	];
	const isValidOperation = updates.every((update) => allwoedUpdates.includes(update));

	if (!isValidOperation) {
		console.log("not vaild update");
		return res.status(400).json("error: Invalid updates!");
	}

	if (req.role == "user") {
		console.log("fisrt if ");
		UserModel.findById(req.user._id)
			.then((user) => {
				console.log("fir then ");
				if (!user) {
					console.log("sec if");
					throw new Error("User Not Found");
				}

				let hashedPassword = bcrypt.hashSync(req.body.password, 15);

				updates.forEach(({ password, ...update }) => {
					console.log(update);
					user[update] = req.body[update];
				});

				return user.save();
			})
			.then((data) => {
				console.log("sec then ");
				res.status(201).json({ data });
			})
			.catch((e) => {
				console.log(e);
				res.status(500).json(e);
			});
	} else {
		throw new Error("Not Authorized.");
	}
};

// Update User-Profile
exports.addAddress = (req, res, next) => {
	errorHandeler(req);

	// Case => update not valid keys
	const updates = Object.keys(req.body);
	const allwoedUpdates = ["address", "country", "street", "city", "building"];
	const isValidOperation = updates.every((update) => allwoedUpdates.includes(update));
	if (!isValidOperation) {
		return res.status(400).json("error: Invalid updates!");
	}

	if (req.role == "user") {
		UserModel.findById(req.user._id)
			.then((user) => {
				if (!user) {
					throw new Error("User Not Found");
				}

				updates.forEach((update) => {
					user[update].push(req.body[update]);
				});

				return user.save();
			})
			.then((data) => {
				res.status(201).json({ data });
			})
			.catch((e) => {
				res.status(500).json(e);
			});
	} else {
		throw new Error("Not Authorized.");
	}
};

// Delete User-Profile
exports.deleteProfile = (req, res, next) => {
	errorHandeler(req);

	if (req.role == "user") {
		UserModel.findByIdAndDelete(req.user._id)
			.then((user) => {
				if (!user) {
					return res.status(404).json();
				}
				res.status(302).json(user);
			})
			.catch((e) => {
				res.status(500).json(e);
			});
	} else {
		throw new Error("Not Authorized.");
	}
};
