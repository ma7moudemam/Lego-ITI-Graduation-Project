const express = require("express");
const router = express.Router();
const controller = require("../Controllers/shopController");
const isAuth = require("./../middelWare/auth");
const { body, query, param } = require("express-validator")

router
    .route("/shop")

    .get( [], controller.getAllProducts)

    .post(controller.addProduct)

    .delete( isAuth, controller.deleteProduct)

    .put(  controller.updateProduct)

router.route("/product")
    .get( [], controller.getProduct)

router.route("/rating").put(controller.updateProductRating)

module.exports=router;