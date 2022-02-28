const errorHandeler = require("./errorHandeler.js")
const ProductModel = require('./../Models/productModel')

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




