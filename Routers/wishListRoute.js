const express = require("express");
const wishListRouter = express.Router();
//controller
const controller = require("./../Controllers/wishlistController");
//auth MW
const isAuth = require("./../middelWare/auth");

wishListRouter.route("/wishlist")
    .get(isAuth, controller.getWishlist)
    .put(isAuth, controller.updateWishlist)
    .delete(isAuth, controller.deleteFromWishlist);

wishListRouter.route('/deleteFromWishlist').put(isAuth, controller.deleteFromWishlist)

module.exports = wishListRouter;