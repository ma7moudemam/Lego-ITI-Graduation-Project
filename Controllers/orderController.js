const Order = require("./../Models/orderModel");

exports.getAllOrders = (req, res, next) => {
    Order.find({}).populate('user').populate('product').populate('shippers').populate('payment').then(orders => {
        res.status(200).send(orders)
    }).catch(err => next(err))
}



exports.getOrder = (req, res) => {

    Order.findById(req.body.id).populate('user').populate('produst').populate('shippers').populate('payment')
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            next(error);
        })
}


exports.addOrder = (req, res, next) => {

    let order = new Order({
        user: req.body.user,
        shippers: req.body.shippers,
        order_status: req.body.order_status,
        tax: req.body.tax,
        payment: req.body.payment,
        order_date: req.body.order_date,
        product: req.body.product
    })
    order.save()
        .then(data => res.status(201).json({ message: "added", data }))
        .catch(error => next(error));
}


exports.updateOrder = (request, response, next) => {
    Order.findByIdAndUpdate(request.body.id, {
            $set: {
                user: req.body.user,
                shippers: req.body.shippers,
                order_status: req.body.order_status,
                tax: req.body.tax,
                payment: req.body.payment,
                order_date: req.body.order_date,
                product: req.body.product
            }
        })
        .then(data => {
            if (data == null) throw new Error("Order is not Find");
            response.status(200).json({ message: "Updated" }, data);
        })
        .catch(err => next(err))
}


exports.deleteOrder = (request, response, next) => {
    Event.findByIdAndDelete(request.body.id)
        .then(data => {
            if (data == null) throw new Error("Order is not Found");
            response.status(200).json({ message: "Deleted" })
        })
        .catch(err => next(err))
}