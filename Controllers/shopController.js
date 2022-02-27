const { validationResult } = require("express-validator");
const Product = require("./../Models/productModel");
const fs = require("fs");
const path = require("path");

exports.getAllProducts = (req, res, next) => {
   
    Product.find({}).then(products => {
        res.status(200).send(products)
    }).catch(err => console.log(err))
}

exports.getProduct = (req, res) => {

    Product.findById( req.body.id )
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            next(error);
        })
}

exports.addProduct = (req, res, next) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = new Error();
        error.status = 422;
        error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
        throw error;
    }
    console.log(req.file.filename)
    let product = new Product({
        name: req.body.name,
        sold: req.body.sold,
        amount: req.body.amount,
        price:req.body.price,
        // rating: request.body.rating,
        images: [req.file.filename],
    }) 
    product.save().then(product => res.status(201).json(product))
}
exports.updateProduct = (req, res) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = new Error();
        error.status = 422;
        error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
        throw error;
    }

    Product.findByIdAndUpdate(req.body.id,{
            $set:{
                name: req.body.name,
                sold: req.body.sold,
                amount: req.body.amount,
                price:req.body.price,
            },
            $push: { images : [req.file.filename] }  
        })
    .then(product => res.status(201).json(product))
}
exports.deleteProduct = (req, res, next) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = new Error();
        error.status = 422;
        error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
        throw error;

    }
    Product.findByIdAndDelete(req.body.id)
    
            .then(data=>{
                if(data==null) throw new Error("Product Is not Found!")
                console.log(data.images[0])
                data.images.forEach(image => {
                    fs.unlinkSync(path.join(__dirname, "..//images//") + image);
                })
                res.status(200).json({message:"deleted"})
            })
            .catch(error=>next(error))
    // product.save().then(product => res.status(201).json(product))
    // res.status(200).json({ data: "delete product" })
}
