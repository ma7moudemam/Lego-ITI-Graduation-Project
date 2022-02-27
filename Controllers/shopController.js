const { validationResult } = require("express-validator");
const Product = require("./../Models/productModel");

const fs = require("fs");
const path = require("path");
const errorHandeler = require("./errorHandeler");

exports.getAllProducts = (req, res, next) => {
   
    Product.find({}).populate('category').then(products => {
        res.status(200).send(products)
    }).catch(err => console.log(err))
}

exports.getProduct = (req, res) => {

    Product.findById( req.body.id ).populate('category')
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            next(error);
        })
}

exports.addProduct = (req, res, next) => {

    errorHandeler(req);
    let images = [];
    req.files.forEach(image => images.push(image.filename));

    let product = new Product({
        name: req.body.name,
        sold: req.body.sold,
        amount: req.body.amount,
        price:req.body.price,
        // rating: request.body.rating,
        images: [...images], 
        category: req.body.categoryId
    }) 
    product.save().then(product => res.status(201).json(product))
}
exports.updateProduct = (req, res) => {

    errorHandeler(req);
    Product.findByIdAndUpdate(req.body.id,{
            $set:{
                name: req.body.name,
                sold: req.body.sold,
                amount: req.body.amount,
                price:req.body.price,
            },
            $push: { images : req.file.filename }  
        })
    .then(product => res.status(201).json(product))
}
exports.deleteProduct = (req, res, next) => {

    errorHandeler(req);
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
