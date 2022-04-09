const { validationResult } = require("express-validator");
const Product = require("./../Models/productModel");

const fs = require("fs");
const path = require("path");
const errorHandeler = require("./errorHandeler");

exports.getAllProducts = async (req, res, next) => {
   
    let page = req.query.page || 1;
    let limit = req.query.limit || 5;

    let query = {};
    let filter = JSON.parse(req.query.filter);
    console.log(filter);

    let priceRange = filter?.priceRange?.map(range=>{return {price: {$gte :  range.split('-')[0], $lte : range.split('-')[1]}}})
    if(priceRange?.length >0) {
         query = {$or: priceRange} 
    } 
    
    let category = filter.category
    if(category && category.length > 0) {
        let categoryQuery =  {category : { $in: category.map(val=>+val) }} 
        query = {
            ...query,
           ...categoryQuery
        }

    }

    let ratingFilter = filter.rating
    if(ratingFilter && ratingFilter.length > 0) {
        let ratingQuery =  {rating : { $in: ratingFilter.map(val=>+val) }} 
        query = {
            ...query,
           ...ratingQuery
        }

    }
    console.log('THE QUERY ',query);

    Product.find(query)
        .limit(limit)
        .skip( (page* limit)- limit)
        .populate('category')
    .then(products => {
        Product.find(query).then((data) => {
            
            res.status(200).send({products:products, count: data.length})
        });
    })
    .catch(err => console.log(err))
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

    // if ( req.role == "admin" ){
        let images = [];
        req.files.forEach(image => images.push(image.filename));
        console.log("=====>",req)
        let product = new Product({
            name: req.body.name,
            sold: req.body.sold,
            amount: req.body.amount,
            price:req.body.price,
            rating: req.body.rating || 1,
            images: [...images], 
            category: req.body.categoryId
        }) 
        product.save().then(product => res.status(201).json(product))
    // }else {
    //     throw new Error("Not Authorized.");
    // }
}
exports.updateProduct = (req, res) => {
    errorHandeler(req);

    if ( req.role == "admin" ){
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
    }else {
        throw new Error("Not Authorized.");
    }
}
exports.updateProductRating = (req, res) => {
    errorHandeler(req);
    console.log(req.body, )
        Product.findByIdAndUpdate(req.body._id,{
                $set:{
                    ...req.body,
                    rating: req.body.rating
                } 
            })
        .then(product => res.status(201).json(product))
}

exports.deleteProduct = (req, res, next) => {
    errorHandeler(req);

    if ( req.role == "admin" ){
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
        }else {
            throw new Error("Not Authorized.");
       }
    // product.save().then(product => res.status(201).json(product))
    // res.status(200).json({ data: "delete product" })
}
