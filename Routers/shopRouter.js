const express = require("express");
const router = express.Router();
const controller = require("../Controllers/shopController");

const { body, query, param } = require("express-validator")

router
    .route("/shop")

    .get( [], controller.getAllProducts)

    .post([], controller.addProduct)

    .delete( [], controller.deleteProduct)

    .put( [], controller.updateProduct)



router.route("/product")
    .get( [], controller.getProduct)

module.exports=router;