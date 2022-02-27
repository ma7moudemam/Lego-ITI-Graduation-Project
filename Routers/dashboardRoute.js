const express = require("express");
const { body } = require("express-validator");
const dashboardRouter = express.Router();
//controller
const controller = require("./../Controllers/dashboardController");
//auth MW

dashboardRouter.get("/dashboard", controller.statistics);

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
    .put(controller.updateProduct)
    .delete(controller.deleteProduct);
// users
dashboardRouter.route("/dashboard/users")
    .get(controller.getAllUsers);
//orders
dashboardRouter.route("/dashboard/orders")
    .get(controller.getAllOrders)
//reviews
dashboardRouter.route("/dashboard/reviews")
    .get(controller.getAllReviews)
    .delete(controller.deleteReview);

dashboardRouter.route("/dashboard/stock")
    .get(controller.getStock)
    .post([
        body("product").isInt().withMessage("product is intger")
    ], controller.addToStock)
    .put(controller.updateStock)
    .delete(controller.deleteStock);

dashboardRouter.route("/dashboard/category")
    .get(controller.getAllCategories)
    .post([
        body("categoryName").isString().withMessage("category name must be a text"),
        body("products").isInt().withMessage("products is integer")
    ], controller.addNewCategory)
    .put(controller.updateCategory)
    .delete(controller.deleteCategory);

dashboardRouter.route("/dashboard/shipper")
    .get(controller.getAllShippers)
    .post([
        body("shipperName").isString().withMessage("shippername must be text"),
        body("contact.email").isEmail().withMessage("you should enter valid email"),
        body("contact.phoneNumber").isInt().withMessage("phone number is not valid")
    ], controller.addNewShipper)
    .put(controller.updateShipper)
    .delete(controller.deleteShipper);

module.exports = dashboardRouter;
