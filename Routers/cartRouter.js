const express = require("express");
const router = express.Router();
const controller = require("../Controllers/cartController");
const isAuth = require("./../middelWare/auth");
const { body, query, param } = require("express-validator")

router
    .route("/cart")

    .get( isAuth,controller.getCart)

    .post(isAuth, controller.createCart)

    .delete( isAuth, controller.deleteFromCart)

router.route("/cart/AddToCart")
    .put( isAuth, controller.addToCart)

router.route("/cart/UpdateCart")
    .put( isAuth,controller.updateCart)

module.exports=router;


