const Users = require("./../Models/userModel");
const Product = require("./../Models/productModel");
const Orders = require("./../Models/orderModel");
const Review = require("./../Models/reviewModel");
const Stock = require("./../Models/stockModel");
const Category = require("./../Models/categoryModel");
const Shipper = require("./../Models/shippersModel");
const Blacklist = require("./../Models/blacklistModel");
const errHandler = require("./../Controllers/errorHandeler");
const bcrypt = require("bcrypt");

exports.statistics = (req, res, next) => {
	// should get number of users
	if (req.role === "admin") {
		let usersCount;
		let ordersCount;
		Users.count()
			.then((data) => {
				if (data == null) throw new Error("nothing to show here");
				usersCount = data;
			})
			.catch((err) => next(err));
		// // number of orders
		Orders.count()
			.then((data) => {
				if (data == null) throw new Error("nothing to show here");
				ordersCount = data;
			})
			.catch((err) => next(err));
		// latest review
		Review.find({})
			.sort({ _id: -1 })
			.limit(5)
			.then((data) => {
				if (data == null) throw new Error("nothing to show here");
				console.log(test);
				res.status(200).json({ data: "statistics", body: { usersCount, ordersCount, review: data } });
			})
			.catch((err) => next(err));
	}
};
/************ product ***********/
exports.getAllProducts = (req, res, next) => {
	// should get all products
	Product.find({})
		.sort({ _id: -1 })
		.populate("category")
		.then((data) => {
			if (data == null) throw new Error("you have zero products");
			res.status(200).json({ data: "your products on a silver plate", products: data });
		})
		.catch((err) => next(err));
};

exports.addProduct = (req, res, next) => {
	errHandler(req);
	// should add new product

	let imagesNames = [];

	for (let i = 0; i < req.files.length; i++) {
		imagesNames.push(new Date().toLocaleDateString().replace(/\//g, "-") + "-" + req.files[i].originalname);
	}

	if ((req.role = "admin")) {
		Product.find({ name: req.body.productName }).then((data) => {
			if (data.length === 0) {
				let newProduct = new Product({
					name: req.body.productName,
					images: imagesNames,
					price: req.body.price,
					amount: req.body.amount,
					sold: 0,
					rating: req.body.rating,
					category: req.body.category,
				});

				newProduct
					.save()
					.then((data) => {
						if (data == null) throw new Error("we didn't add the product");
						res.status(201).json({ message: "Product has been added", data });
					})
					.catch((err) => next(err));
			} else {
				res.status(406).json({ message: "You can't add 2 products with the same name" });
			}
		});
	} else {
		throw new Error("u r not authorized to add product");
	}
};

exports.updateProduct = (req, res, next) => {
	if (req.role === "admin") {
		console.log(req.body);
		Product.updateOne(
			{ _id: req.body.id },
			{
				$set: {
					name: req.body.productName,
					price: req.body.price,
					amount: req.body.amount,
					sold: 0,
					category: req.body.category,
					// images: req.file.filename,
				},
			}
		)
			.then((data) => {
				if (data == null) throw new Error(`we have no product with this id ${req.body.id}`);
				res.status(200).json({ message: "updated", body: data });
			})
			.catch((err) => next(err));
	} else {
		throw new Error("You are not authorized.");
	}
};
exports.deleteProduct = (req, res, next) => {
	console.log(req.body);
	if (req.role === "admin") {
		console.log(req.body);
		Product.deleteOne({ _id: req.body.id })
			.then((data) => {
				if (data == null) throw new Error("something went wrong while deleting the product");
				res.status(200).json({ data: "Product deleted", body: data });
			})
			.catch((err) => next(err));
	} else {
		throw new Error("You are not authorized.");
	}
};

/************** user *********** */

exports.getAllUsers = (req, res, next) => {
	// should get all products
	if (req.role === "admin") {
		Users.find({})
			.sort({ _id: -1 })
			.then((data) => {
				if (data == null) throw new Error("you have zero Users");
				res.status(200).json({ data: "your Users on a silver plate", users: data });
			})
			.catch((err) => next(err));
	}
};

// the admin can put a user in the blacklist
exports.getBlockedUsers = (req, res, next) => {
	if (req.role === "admin") {
		Blacklist.find({})
			.then((data) => {
				if (data === null) throw new Error("black list is empty");
				res.status(200).json({ message: "blacklist is here", blacklist: data });
			})
			.catch((err) => console.log(err));
	}
};

exports.sendUserToBlacklist = (req, res, next) => {
	// should get all users
	if (req.role === "admin") {
		Users.findOne({ _id: req.body.id }).then((data) => {
			if (data == null) throw new Error("we have no user with such id");
			// add the use into the blacklist collection
			let addToBlacklist = new Blacklist({
				user: data.id,
			});

			addToBlacklist.save().then((data) => {
				if (data == null) throw new Error("we didn't add the product");
				res.status(201).json({ message: "user added to blacklist", data });
			});
		});
	} else {
		throw new Error("u r not authorized");
	}
};
exports.blockUser = (req, res, next) => {
	console.log(req.body);
	if (req.role === "admin") {
		Users.updateOne(
			{ _id: req.body.id },
			{
				$set: {
					blocked: req.body.blocked,
				},
			}
		)
			.then((data) => {
				if (data == null) throw new Error(`we have no users with this id ${req.body.id}`);
				res.status(200).json({ message: "user has been blocked", body: data });
			})
			.catch((err) => next(err));
	}
};
exports.unBlockUser = (req, res, next) => {
	if (req.role === "admin") {
		Blacklist.deleteOne({ user: req.body.user })
			.then((data) => {
				if (data == null) throw new Error("something went wrong while unblocking the user");
				res.status(200).json({ data: "User has been unblocked", body: data });
			})
			.catch((err) => next(err));
	}
};
/************** orders *********** */
// the admin can see all the orders
exports.getAllOrders = (req, res, next) => {
	// should get all orders
	console.log(req.role);
	if (req.role === "admin") {
		Orders.find({})
			.sort({ _id: -1 })
			.populate("user")
			.populate("products.product")
			.then((data) => {
				if (data == null) throw new Error("something went wrong while getting orders");
				res.status(200).json({ data: "orders is here", orders: data });
			})
			.catch((err) => next(err));
	}
};

exports.getRecentOrders = (req, res, next) => {
	if (req.role === "admin") {
		Orders.find({})
			.sort({ _id: -1 })
			.limit(5)
			.populate("user")
			.populate("products.product")
			.then((data) => {
				if (data == null) throw new Error("something went wrong while getting orders");
				res.status(200).json({ data: "orders is here", orders: data });
			})
			.catch((err) => console.log(err));
	}
};
exports.getOrderByDate = (req, res, next) => {
	if (req.role === "admin") {
		let date = req.body.date.end.split("/");
		date.splice(1, 1, Number(date[1]) + 1);
		let endDate = date.join("/");

		// console.log(endDate)
		// console.log(req.body)

		Orders.find({
			order_date: {
				$gte: req.body.date.start,
				$lt: endDate,
			},
		})
			.populate("user")
			.populate("products")
			.then((data) => {
				res.status(200).json({
					message: `Your orders from ${req.body.date.start} to ${req.body.date.end}`,
					orders: data,
				});
			})
			.catch((error) => {
				next(error);
			});
	}
};
exports.updateOrder = (req, res, next) => {
	// should get all orders
	if (req.role === "admin") {
		Orders.updateOne(
			{ _id: req.body.id },
			{
				$set: {
					shipper: req.body.shipper,
					isPending: true,
				},
			}
		).then((data) => {
			if (data == null) throw new Error("something went wrong while getting orders");
			res.status(200).json({ data: "orders is here", orders: data });
		});
	}
};

/************** review *********** */
// the admin can see all the review
// can add a reply on a review
// can delete a review

exports.getAllReviews = (req, res, next) => {
	// should get all review
	if (req.role === "admin") {
		Review.find({})
			.sort({ _id: -1 })
			.then((data) => {
				if (data == null) throw new Error("something went wrong while getting review");
				res.status(200).json({ data: "review is here", reviews: data });
			})
			.catch((err) => next(err));
	}
};

exports.deleteReview = (req, res, next) => {
	if (req.role === "admin") {
		Review.deleteOne({ _id: req.body.id })
			.then((data) => {
				if (data == null) throw new Error("something went wrong while deleting the review");
				res.status(200).json({ data: "review has been deleted", body: data });
			})
			.catch((err) => next(err));
	}
};

/************** stock *********** */
exports.getStock = (req, res, next) => {
	errHandler(req);
	if (req.role === "admin") {
		Stock.find({})
			.sort({ _id: -1 })
			.then((data) => {
				if (data == null) throw new Error("something went wrong while getting stock");
				res.status(200).json({ data: "your stock is here", body: data });
			})
			.catch((err) => next(err));
	}
};
exports.addToStock = (req, res, next) => {
	if (req.role === "admin") {
		let newStockItem = new Stock({
			product: req.body.products,
		});
		newStockItem.save().then((data) => {
			if (data == null) throw new Error("we didn't add the item to the stock");
			res.status(201).json({ message: "added", data });
		});
	}
};
exports.updateStock = (req, res, next) => {
	if (req.role === "admin") {
		Stock.updateOne(
			{ _id: req.body.id },
			{
				$set: {
					product: req.body.products,
				},
			}
		)
			.then((data) => {
				if (data == null) throw new Error(`we have no stock items with this id ${req.body.id}`);
				res.status(200).json({ data: "updated", body: data });
			})
			.catch((err) => next(err));
	}
};
exports.deleteStock = (req, res, next) => {
	if (req.role === "admin") {
		Stock.deleteOne({ _id: req.body.id })
			.then((data) => {
				if (data == null) throw new Error("something went wrong while deleting the stock item");
				res.status(200).json({ data: "stock item has been deleted", body: data });
			})
			.catch((err) => next(err));
	}
};
/************** category *********** */

exports.getAllCategories = (req, res, next) => {
	Category.find({})
		.then((data) => {
			if (data == null) throw new Error("something went wrong while getting category");
			res.status(200).json({ data: "your category is here", body: data });
		})
		.catch((err) => next(err));
};
exports.addNewCategory = (req, res, next) => {
	errHandler(req);
	if (req.role === "admin") {
		console.log(req.body);
		let cateName = req.body.categoryName.toLowerCase();
		Category.find({ name: cateName })
			.then((data) => {
				console.log(data);
				if (data.length == 0) {
					let newCategory = new Category({
						name: cateName,
					});
					newCategory.save().then((data) => {
						if (data == null) throw new Error("we didn't add the item to the categories");
						res.status(201).json({ message: "added", data });
					});
				} else {
					res.status(400).json({ message: "You can't add 2 categories with same name" });
				}
			})
			.catch((err) => next(err));
	} else {
		throw new Error("you r not authorized to add new Category");
	}
};
exports.updateCategory = (req, res, next) => {
	console.log(req.body);
	if (req.role === "admin") {
		Category.updateOne(
			{ _id: req.body.id },
			{
				$set: {
					name: req.body.name,
					// products: req.body.products
				},
			}
		)
			.then((data) => {
				if (data == null) throw new Error(`we have no Category with this id ${req.body.id}`);
				res.status(200).json({ data: "updated", body: data });
			})
			.catch((err) => next(err));
	}
};
exports.deleteCategory = (req, res, next) => {
	if (req.role === "admin") {
		Category.deleteOne({ _id: req.body.id })
			.then((data) => {
				if (data == null) throw new Error("something went wrong while deleting the Category");
				res.status(200).json({ data: "Category has been deleted", body: data });
			})
			.catch((err) => next(err));
	}
};

/************** shipper *********** */
exports.getAllShippers = (req, res, next) => {
	if (req.role === "admin") {
		Shipper.find({})
			.then((data) => {
				if (data == null) throw new Error("something went wrong while getting shippers");
				res.status(200).json({ data: "your shippers is here", shippers: data });
			})
			.catch((err) => next(err));
	}
};
exports.addNewShipper = (req, res, next) => {
	errHandler(req);
	if (req.role === "admin") {
		Shipper.findOne({ email: req.body.shipperEmail })
			.then((data) => {
				if (data === null) {
					let hashedPassword = bcrypt.hashSync(`${req.body.shipperName}@lego`, 15);

					let newShipper = new Shipper({
						name: req.body.shipperName,
						userName: req.body.shipperName,
						password: hashedPassword,
						email: req.body.shipperEmail,
						phone_number: req.body.phoneNumber,
					});
					newShipper.save().then((data) => {
						if (data == null) throw new Error("we didn't add the item to the shippers");
						res.status(201).json({ message: "shipper added", data });
					});
				} else {
					res.status(406).json({ message: " You can't sign up 2 shippers with same email or name" });
				}
			})
			.catch((err) => next(err));
	}
};
exports.updateShipper = (req, res, next) => {
	if (req.role === "admin") {
		Shipper.updateOne(
			{ _id: req.body.id },
			{
				$set: {
					orders: req.body.orders,
				},
			}
		)
			.then((data) => {
				if (data == null) throw new Error(`we have no Shipper with this id ${req.body.id}`);
				res.status(200).json({ data: "updated", body: data });
			})
			.catch((err) => next(err));
	}
	if (req.role === "shipper") {
		Shipper.updateOne(
			{ _id: req.body.id },
			{
				$set: {
					password: req.body.password,
				},
			}
		)
			.then((data) => {
				if (data == null) throw new Error(`we have no Shipper with this id ${req.body.id}`);
				res.status(200).json({ data: "updated", body: data });
			})
			.catch((err) => next(err));
	}
};
exports.deleteShipper = (req, res, next) => {
	// if (req.role === "admin") {
	Shipper.deleteOne({ _id: req.body.id })
		.then((data) => {
			if (data == null) throw new Error("something went wrong while deleting the Shipper");
			res.status(200).json({ data: "Shipper has been deleted", body: data });
		})
		.catch((err) => next(err));
	// }
};
