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

        //  let products = [];   
        // carts.product.forEach(element => {
        //     let newCart = {...element, quantity: carts.product.filter(p => p._id == element._id).length};
        //     // element["quantity"] = carts.product.filter(p => p._id == element._id).length;
        //     console.log(carts.product.filter(p => p._id == element._id).length)
        //     if(!products.includes(newCart._id)) 
        //         products.push(newCart)
        // });

        // console.log(products);
        res.status(200).send(carts)
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
