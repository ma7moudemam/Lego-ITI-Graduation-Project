const errorHandeler = require("./errorHandeler.js");
const UserModel = require("./../Models/userModel");
const bcrypt = require("bcrypt");

exports.postUser = (req, res, next) => {
	console.log("in");
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

// Get Users => Admin
exports.getAllUsers = (req, res, next) => {
	errorHandeler(req);

	if (req.role == "admin") {
		UserModel.find({})
			.then((users) => {
				res.status(200).send(users);
			})
			.catch((e) => {
				res.status(500).send(e);
			});
	} else {
		throw new Error("Not Authorized.");
	}
};

// Get User-Profile
exports.getProfile = (req, res, next) => {
	errorHandeler(req);
	if (req.role == "user") {
		res.status(200).send(req.user);
	} else {
		throw new Error("Not Authorized.");
	}
};

// Update User-Profile
exports.updateProfile = (req, res, next) => {
	errorHandeler(req);



	// Case => update not valid keys
	const updates = Object.keys(req.body);
	const allwoedUpdates = ["email", "password", "year", "month", "day", "address", "country", "street", "city", "building"];
	const isValidOperation = updates.every((update) => allwoedUpdates.includes(update));
	if (!isValidOperation) {
		return res.status(400).send("error: Invalid updates!");
	}

	if (req.role == "user") {
		UserModel.findById(req.user._id)
			.then((user) => {
				if (!user) {
					throw new Error("User Not Found");
				}
				// user.age: getAge(),
				updates.forEach((update) => {
					user[update] = req.body[update];
				});

				return user.save();
			})
			.then((data) => {
				res.status(201).send({ data });
			})
			.catch((e) => {
				res.status(500).send(e);
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
		return res.status(400).send("error: Invalid updates!");
	}

	if (req.role == "user") {
		UserModel.findById(req.user._id)
			.then((user) => {
				if (!user) {
					throw new Error("User Not Found");
				}

				updates.forEach((update) => {
					user[update].push(req.body[update])
				});

				return user.save();
			})
			.then((data) => {
				res.status(201).send({ data });
			})
			.catch((e) => {
				res.status(500).send(e);
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
					return res.status(404).send();
				}
				res.status(302).send(user);
			})
			.catch((e) => {
				res.status(500).send(e);
			});
	} else {
		throw new Error("Not Authorized.");
	}
};
