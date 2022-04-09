const Cart = require("./../Models/cartModel");
const errorHandeler = require("./errorHandeler");

exports.createCart = (req, res, next) => {
	let cart = new Cart({
		total_price: 0,
		product: [],
		user: req.user.id,
	});

	cart.save().then((cart) => res.status(201).json(cart));
};
exports.getCart = (req, res, next) => {

    Cart.findOne({ user: 1 })
        .populate("product.product")
        .then((carts) => {
            
          
            if(!carts) {
              
                let cart = new Cart({
                    total_price: 0,
                    product: [],
                    totalItemsCount: 0,
                    // user: req.user.id,
                    user: 1
                });
                cart.save().then((cart) => res.status(201).json(cart));
             }
            res.status(200).send({ total_price: carts.total_price, carts });
        })
        .catch((err) => console.log(err));
};

exports.addToCart = (req, res, next) => {
	errorHandeler(req);
	// let products = Array(req.body.quantity).fill(req.body.productId);
        Cart.updateOne(
            { user: req.user.id },
            {
                $set: {
                    total_price: req.body.total_price,
                    // user: req.user.id
                },
                $push: { product: req.body.productId },
            }
        ).then((cart) => res.send(cart));
    
};

exports.updateCart = (req, res, next) => {
	errorHandeler(req);
      console.log(req.body);
        Cart.updateOne(
            { user: 1 },
            {
                $set: {
                    total_price: req.body.totalPrice || 0,
                     product: Object.values(req.body.products).map(prod=>{return{product:prod._id,quantity:prod.quantity}}),
                     totalItemsCount:req.body.totalItemsCount
                    // user: req.user.id
                },
            }
        ).then((cart) => res.send(cart));
    
};
exports.deleteFromCart = (req, res, next) => {
	errorHandeler(req);

            Cart.updateOne(
            { user: req.user.id },
            {
                $set: {
                    total_price: req.body.total_price,
                    // user: req.user.id
                },
                $pullAll: { product: req.body.productId },
            }
        ).then((cart) => res.send(cart));
    
};
