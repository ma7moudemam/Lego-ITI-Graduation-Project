const Order = require("./../Models/orderModel");
const errorHandeler = require("./../Controllers/errorHandeler");
exports.getAllOrders = (req, res, next) => {
	errorHandeler(req);
	Order.find({})
		.populate("user")
		.populate("products.product")
		.populate("shippers")
		.populate("payment")
		.then((orders) => {
			res.status(200).send(orders);
		})
		.catch((err) => next(err));
};

exports.findShippersOrders = (req, res, next) => {
	Order.find({ shipper: req.body.id })
		.populate("user")
		.populate("products")
		.then(data => {
			if (data.length === 0) throw new Error("you don't have orders")
			res.status(200).json({ message: "You have orders to deliver", orders: data })
		}).catch(err => next(err))
}

exports.getOrder = (req, res, next) => {
	errorHandeler(req);
	console.log(req.body)
	Order.find({
		order_date: {
			$gte: req.body.date.start,
			$lt: req.body.date.end
		}
	})
		.populate("user")
		.populate("products")

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
		total_price: req.body.total_price,
		order_date: new Date().toLocaleDateString(),
		// order_date: req.body.date,
		products: req.body.products,
		session_id: req.body.session_id,
	});
	order
		.save()
		.then((data) => res.status(201).json({ message: "added", data }))
		.catch((error) => next(error));
};

exports.updateOrder = (request, response, next) => {
	// errorHandeler(request);
	console.log(request.body)
	Order.findById(request.body.id).then((data) => {
		if (data == null) throw new Error("Order is not Find");
		data["isDelivered"] = request.body.isDelivered
		data["isPending"] = request.body.isPending
		data["isShipped"] = request.body.isShipped
		// response.status(201).json({ message: "Updated", data });
		return data.save();
	}).then(data => {
		response.status(201).json({ message: "Updated", data });

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
	Order.find({ user: req.user._id }).sort({ _id: 1 })
		.populate("products.product")
		.populate("user")
		.populate("shipper")
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((error) => {
			// next(error);
			console.log(error);
		});
};
