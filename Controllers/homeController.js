const errorHandeler = require("./errorHandeler.js");
const ProductModel = require("./../Models/productModel");

exports.getProducts = async (req, res, next) => {
	errorHandeler(req);

	try {
		const products = await ProductModel.random();
		res.status(201).send({ products });
	} catch (e) {
		res.status(400).send(e);
	}
};

// Get Random Products
exports.getRandomProducts = async (req, res, next) => {
	errorHandeler(req);
	try {
		const randomProduct = await ProductModel.aggregate([{ $sample: { size: 7 } }]);
		return res.status(201).send({ randomProduct });
	} catch (e) {
		res.status(400).send(e);
	}
};

// Get new Products
exports.getNewProducts = async (req, res, next) => {
	errorHandeler(req);
	try {
		const newProducts = await ProductModel.find({}).sort({ _id: -1 }).limit(4);

		console.log(newProducts);

		return res.status(201).send({ newProducts });
	} catch (e) {
		res.status(400).send(e);
	}
};

// get trending products
exports.getTrendingProducts = async (req, res, next) => {
	errorHandeler(req);
	try {
		const trendingProducts = await ProductModel.find({ rating: { $gte: 3 } }).limit(4);

		return res.status(201).send({ trendingProducts });
	} catch (e) {
		res.status(400).send(e);
	}
};
