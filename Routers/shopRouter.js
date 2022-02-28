const express = require("express");
const router = express.Router();
const controller = require("../Controllers/shopController");
const isAuth = require("./../middelWare/auth");
const { body, query, param } = require("express-validator")

router
    .route("/shop")

    .get( [], controller.getAllProducts)

    .post(isAuth, controller.addProduct)

    .delete( isAuth, controller.deleteProduct)

    .put( isAuth, controller.updateProduct)

router.route("/product")
    .get( [], controller.getProduct)


module.exports=router;