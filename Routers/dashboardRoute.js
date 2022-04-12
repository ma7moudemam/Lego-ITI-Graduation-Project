const express = require("express");
const { body } = require("express-validator");
const dashboardRouter = express.Router();
//controller
const controller = require("./../Controllers/dashboardController");
//auth MW
const isAuth = require("./../middelWare/auth");

dashboardRouter.get("/dashboard", isAuth, controller.statistics);

// products
dashboardRouter.route("/dashboard/products")
    .get(controller.getAllProducts)
    .post([
        body("productName").isString().withMessage("ProductName must be text"),
        body("price").isInt().withMessage("price is mandatory and must be a number"),
        body("amount").isInt().withMessage("amount is mandatory and must be a number"),
        body("sold").isInt().withMessage("amount is mandatory and must be a number"),
        body("rating").isInt().withMessage("rating is not valid")
    ], controller.addProduct)
    .put(isAuth, controller.updateProduct)
    .delete(isAuth, controller.deleteProduct);
// users
dashboardRouter.route("/dashboard/users")
    .get(controller.getAllUsers)
    .post([body("email").isEmail().withMessage("email is a must")], controller.sendUserToBlacklist);
//orders
dashboardRouter.route("/dashboard/orders")
    .get(isAuth, controller.getAllOrders)
//reviews
dashboardRouter.route("/dashboard/reviews")
    .get(isAuth, controller.getAllReviews)
    .delete(isAuth, controller.deleteReview);

dashboardRouter.route("/dashboard/stock")
    .get(isAuth, controller.getStock)
    .post(isAuth, [
        body("product").isInt().withMessage("product is intger")
    ], controller.addToStock)
    .put(isAuth, controller.updateStock)
    .delete(isAuth, controller.deleteStock);

dashboardRouter.route("/dashboard/category")
    .get(controller.getAllCategories)
    .post([
        body("categoryName").isString().withMessage("category name must be a text"),
        // body("products").isArray().withMessage("products is array of integers")
    ], controller.addNewCategory)
    .put(controller.updateCategory)
    .delete(controller.deleteCategory);

dashboardRouter.route("/dashboard/shipper")
    .get(isAuth, controller.getAllShippers)
    .post(isAuth, [
        body("shipperName").isString().withMessage("shippername must be text"),
        body("contact.email").isEmail().withMessage("you should enter valid email"),
        body("contact.phoneNumber").isInt().withMessage("phone number is not valid")
    ], controller.addNewShipper)
    .put(isAuth, controller.updateShipper)
    .delete(isAuth, controller.deleteShipper);

module.exports = dashboardRouter;
