const express = require("express");
const wishListRouter = express.Router();
//controller
const controller = require("./../Controllers/wishlistController");
//auth MW

wishListRouter.route("/wishlist")
    .get(controller.getWishlist)
    .put(controller.updateWishlist)
    .delete(controller.deleteFromWishlist);

module.exports = wishListRouter;