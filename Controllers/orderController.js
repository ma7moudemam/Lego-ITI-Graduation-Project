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
		user: req.body.user,
		isPending: false,
		withShipper: false,
		isShipped: false,
		isDeliverd: false,
		isCanceled: false,
		order_date: new Date().toLocaleDateString(),
		total_price: req.body.total_price,
		products: req.body.products,
		session_id: req.body.session_id,
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
			isPending: req.body.isPending,
			withShipper: req.body.withShipper,
			isShipped: req.body.isShipped,
			isDeliverd: req.body.isDeliverd,
			isCanceled: req.body.isCanceled,
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

exports.getUserOrder = (req, res) => {
	errorHandeler(req);
	Order.find({ user: req.user._id })
		.populate("user")
		.populate("product.product")
		.populate("shipper")
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((error) => {
			// next(error);
			console.log(error);
		});
};
