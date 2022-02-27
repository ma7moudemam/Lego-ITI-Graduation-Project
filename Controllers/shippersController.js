const Shipper = require("./../Models/orderModel");

exports.getAllShippers = (req, res, next) => {
    Order.find({}).then(orders => {
        res.status(200).send(orders)
    }).catch(err => next(err))
}



exports.getShipper = (req, res) => {

    Order.findById(req.body.id)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            next(error);
        })
}


exports.setShipper = (req, res, next) => {

    let shipper = new Order({
        name: req.body.name,
        contact: req.body.contact,
    })
    order.save()
        .then(data => res.status(201).json({ message: "added", data }))
        .catch(error => next(error));
}


exports.updateShipper = (request, response, next) => {
    Order.findByIdAndUpdate(request.body.id, {
            $set: {
                name: req.body.name,
                contact: req.body.contact,
            }
        })
        .then(data => {
            if (data == null) throw new Error("Shipper is not Find");
            response.status(200).json({ message: "Updated" }, data);
        })
        .catch(err => next(err))
}


exports.deleteShipper = (request, response, next) => {
    Event.findByIdAndDelete(request.body.id)
        .then(data => {
            if (data == null) throw new Error("Shipper is not Found");
            response.status(200).json({ message: "Deleted" })
        })
        .catch(err => next(err))
}