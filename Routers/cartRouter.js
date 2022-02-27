const express = require("express");
const router = express.Router();
const controller = require("../Controllers/cartController");

const { body, query, param } = require("express-validator")

router
    .route("/cart")

    .get( [], controller.getCart)

    .post([], controller.createCart)


    .delete( [], controller.deleteFromCart)


router.route("/cart/AddToCart")
    .put( [], controller.addToCart)
router.route("/cart/UpdateCart")
    .put( [], controller.updateCart)

module.exports=router;


