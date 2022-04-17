const Shipper = require("./../Models/shippersModel");

exports.getAllShippers = (req, res, next) => {
	Shipper.find({})
		.then((shippers) => {
			res.status(200).send(shippers);
		})
		.catch((err) => next(err));
};

exports.getShipper = (req, res) => {
	Shipper.findById(req.body.id)
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};

exports.setShipper = (req, res, next) => {
	let shipper = new Shipper({
		name: req.body.name,
		contact: req.body.contact,
	});
	shipper
		.save()
		.then((data) => res.status(201).json({ message: "added", data }))
		.catch((error) => next(error));
};

exports.updateShipper = (request, response, next) => {
	Shipper.findByIdAndUpdate(request.body.id, {
		$set: {
			name: req.body.name,
			contact: req.body.contact,
			password: req.body.password,
		},
	})
		.then((data) => {
			if (data == null) throw new Error("Shipper is not Find");
			response.status(200).json({ message: "Updated" }, data);
		})
		.catch((err) => next(err));
};

exports.deleteShipper = (request, response, next) => {
	Shipper.findByIdAndDelete(request.body.id)
		.then((data) => {
			if (data == null) throw new Error("Shipper is not Found");
			response.status(200).json({ message: "Deleted" });
		})
		.catch((err) => next(err));
};
