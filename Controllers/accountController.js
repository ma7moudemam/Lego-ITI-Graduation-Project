const errorHandeler = require("./errorHandeler.js");
const UserModel = require("./../Models/userModel");
const bcrypt = require("bcrypt");

exports.postUser = (req, res, next) => {
	errorHandeler(req);

	if (req.role == "user") {
		let hashedPassword = bcrypt.hashSync(req.body.password, 15);
		let object = new UserModel({
		email: req.body.email,
		password: hashedPassword,
		age: req.body.age,
		address: {
			country: req.body.country,
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
	}else {
        throw new Error("Not Authorized.");
    }

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
// if (req.role = "user"){
		
// 	}else {
// 		 throw new Error("Not Authorized.");
// 	}

// Get User-Profile
exports.getProfile = (req, res, next) => {
	errorHandeler(req);
	if (req.role == "user"){
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
	const allwoedUpdates = ["email", "password", "age", "address", "country", "street", "city", "building"];
	const isValidOperation = updates.every((update) => allwoedUpdates.includes(update));
	if (!isValidOperation) {
		return res.status(400).send("error: Invalid updates!");
	}

	if (req.role == "user"){
		UserModel.findById(req.user._id)
		.then((user) => {
			if (!user) {
				throw new Error("User Not Found");
			}

			updates.forEach((update) => {
				user[update] = req.body[update];
			});

			// console.log(user)
			return user.save();
		})
		.then((data) => {
			res.status(201).send({ data });
		})
		.catch((e) => {
			res.status(500).send(e);
		});
	}else {
		 throw new Error("Not Authorized.");
	}
	
};

// Delete User-Profile
exports.deleteProfile = (req, res, next) => {
	errorHandeler(req);

	if (req.role == "user" || req.role == "admin" ){
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
	}else {
		 throw new Error("Not Authorized.");
	}
};
