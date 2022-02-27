const Cart = require("./../Models/cartModel");
const errorHandeler = require("./errorHandeler");

exports.createCart = (req,res,next) => {

    let cart = new Cart({
        total_price: 0,
        product: [],
        user: req.user.id
    });

    cart.save().then(cart => res.status(201).json(cart))
}
exports.getCart = (req, res, next) => {
    
    Cart.findOne({user: req.user.id}).populate('product').then(carts => {

         let products = [];   
        carts.product.forEach(element => {
            console.log(element)
            let newPoduct = { 
                _id: element._id,
                name: element.name,
                price: element.price,
                images: element.images,
                quantity: carts.product.filter(p => p._id == element._id).length
            };
            if(!products.includes(newPoduct._id)) 
                products.push(newPoduct)
        });

        res.status(200).send({total_price: carts.total_price, products})
    }).catch(err => console.log(err))
}

exports.addToCart = (req, res, next) => {

    errorHandeler(req);
    // let products = Array(req.body.quantity).fill(req.body.productId);

    Cart.updateOne({user: req.user.id},{
        $set:{
            total_price: req.body.total_price,
            // user: req.user.id
        },
        $push: { product : req.body.productId }  
    }).then(cart => res.send(cart))

}

exports.updateCart = (req, res, next) => {

    errorHandeler(req);


    Cart.updateOne({user: req.user.id},{
        $set:{
            total_price: req.body.total_price,
            product: req.body.productId,
            // user: req.user.id
        } 
    }).then(cart => res.send(cart))

}
exports.deleteFromCart = (req, res, next) => {

    errorHandeler(req);

    Cart.updateOne({user: req.user.id},{
        $set:{
            total_price: req.body.total_price,
            // user: req.user.id
        },
        $pullAll: { product: req.body.productId} 
    }).then(cart => res.send(cart))

}
