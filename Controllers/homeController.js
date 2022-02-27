const errorHandeler = require("./errorHandeler.js")
const ProductModel = require('./../Models/productModel')

// Add Product
exports.addProduct = (req, res, next) => {
    errorHandeler(req);

    const product = new ProductModel(req.body)
    product.save().then((data) => {
        res.status(200).send(data)
    }).catch((e) => {
        res.status(500).send(e)
    })
}

// Get Random Products
exports.getProducts = async (req, res, next) => {
    errorHandeler(req);

    try {
        const products = await ProductModel.random()
        res.status(201).send({products})
        
    } catch (e) {
     res.status(400).send(e)   
    }
}




