const Order = require("./../Models/orderModel");
const errorHandeler = require("./../Controllers/errorHandeler");
exports.getAllOrders = (req, res, next) => {
	errorHandeler(req);
	Order.find({})
		.populate("user")
		.populate("product")
		.populate("shippers")
		.populate("payment")
		.then((orders) => {
			res.status(200).send(orders);
		})
		.catch((err) => next(err));
};

exports.getOrder = (req, res) => {
	errorHandeler(req);
	Order.findById(req.body.id)
		.populate("user")
		.populate("produst")
		.populate("shippers")
		.populate("payment")
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};

exports.addOrder = (req, res, next) => {
	errorHandeler(req);
	let order = new Order({
		user: req.body.email,
		shipper: req.body.shipper,
		order_status: req.body.order_status,
		tax: req.body.tax,
		payment: req.body.payment,
		order_date: new Date().toLocaleDateString(),
		product: req.body.product,
	});
	order
		.save()
		.then((data) => res.status(201).json({ message: "added", data }))
		.catch((error) => next(error));
};

exports.updateOrder = (request, response, next) => {
	errorHandeler(request);
	Order.findByIdAndUpdate(request.body.id, {
		$set: {
			user: request.body.email,
			shipper: request.body.shipper,
			order_status: request.body.order_status,
			tax: request.body.tax,
			payment: request.body.payment,
			order_date: request.body.order_date,
			product: request.body.product,
		},
	})
		.then((data) => {
			if (data == null) throw new Error("Order is not Find");
			response.status(200).json({ message: "Updated" }, data);
		})
		.catch((err) => next(err));
};

exports.deleteOrder = (request, response, next) => {
	errorHandeler(request);
	Order.findByIdAndDelete(request.body.id)
		.then((data) => {
			if (data == null) throw new Error("Order is not Found");
			response.status(200).json({ message: "Deleted" });
		})
		.catch((err) => next(err));
};
