const Users = require("./../Models/userModel");
const Product = require("./../Models/productModel");
const Orders = require("./../Models/orderModel");
const Review = require("./../Models/reviewModel");
const Stock = require("./../Models/stockModel");
const Category = require("./../Models/categoryModel");
const Shipper = require("./../Models/shippersModel");
const Blacklist = require("./../Models/blacklistModel");
const errHandler = require("./../Controllers/errorHandeler");


exports.statistics = (req, res, next) => {
    // should get number of users
    if (req.role === "admin") {
        let usersCount;
        let ordersCount;
        Users.count()
            .then(data => {
                if (data == null) throw new Error("nothing to show here")
                usersCount = data
            }).catch(err => next(err));
        // // number of orders
        Orders.count()
            .then(data => {
                if (data == null) throw new Error("nothing to show here")
                ordersCount = data;
            }).catch(err => next(err));
        // latest review
        Review.find({}).sort({ _id: -1 }).limit(5)
            .then(data => {
                if (data == null) throw new Error("nothing to show here")
                console.log(test)
                res.status(200).json({ data: "statistics", body: { usersCount, ordersCount, review: data } })
            }).catch(err => next(err));
    }

}
/************ product ***********/
exports.getAllProducts = (req, res, next) => {
    // should get all products
    if (req.role === "admin") {
        Product.find({}).sort({ _id: -1 })
            .then(data => {
                if (data == null) throw new Error("you have zero products")
                res.status(200).json({ data: "your products on a silver plate", products: data })
            }).catch(err => next(err))
    }
}

exports.addProduct = (req, res, next) => {
    errHandler(req);
    // should add new product
    if (req.role = "admin") {
        let newProduct = new Product({
            name: req.body.productName,
            // images: [{ type: String, required: true }],
            price: req.body.price,
            amount: req.body.amount,
            sold: 0,
            rating: req.body.rating,
        })

        newProduct.save()
            .then(data => {
                if (data == null) throw new Error("we didn't add the product")
                res.status(201).json({ message: "added", data })
            }).catch(err => next(err))
    }
}

exports.updateProduct = (req, res, next) => {
    if (req.role === "admin") {
        Product.updateOne({ _id: req.body.id }, {
            $set: {
                name: req.body.productName,
                // images: req.file.filename,
                price: req.body.price,
                amount: req.body.amount,
                sold: 0,
            }
        }).then(data => {
            if (data == null) throw new Error(`we have no product with this id ${req.body.id}`);
            res.status(200).json({ data: "updated", body: data })
        }).catch(err => next(err))
    }


}
exports.deleteProduct = (req, res, next) => {
    if (req.role === "admin") {
        Product.deleteOne({ _id: req.body.id })
            .then(data => {
                if (data == null) throw new Error("something went wrong while deleting the product")
                res.status(200).json({ data: "deleted", body: data })
            }).catch(err => next(err))
    }
}

/************** user *********** */
// the admin can put a user in the blacklist
exports.sendUserToBlacklist = (req, res, next) => {
    // should get all users
    if (req.role === "admin") {
        Users.findOne({ _id: req.body.email })
            .then(data => {
                if (data == null) throw new Error("we have no user with such email")
                // add the use into the blacklist collection
                let addToBlacklist = new Blacklist({
                    user: data.email
                })

                addToBlacklist.save()
                    .then(data => {
                        if (data == null) throw new Error("we didn't add the product")
                        res.status(201).json({ message: "user added to blacklist", data })
                    })
            })
    }

}

/************** orders *********** */
// the admin can see all the orders
exports.getAllOrders = (req, res, next) => {
    // should get all orders
    if (req.role === "admin") {
        Orders.find({}).sort({ _id: -1 })
            .then(data => {
                if (data == null) throw new Error("something went wrong while getting orders")
                res.json(200).json({ data: "orders is here", orders: data })
            })
    }
}
/************** review *********** */
// the admin can see all the review
// can add a reply on a review
// can delete a review

exports.getAllReviews = (req, res, next) => {
    // should get all review
    if (req.role === "admin") {
        Review.find({}).sort({ _id: -1 })
            .then(data => {
                if (data == null) throw new Error("something went wrong while getting review")
                res.status(200).json({ data: "review is here", reviews: data })
            }).catch(err => next(err))
    }
}

exports.deleteReview = (req, res, next) => {
    if (req.role === "admin") {
        Review.deleteOne({ _id: req.body.id })
            .then(data => {
                if (data == null) throw new Error("something went wrong while deleting the review")
                res.status(200).json({ data: "review has been deleted", body: data })
            }).catch(err => next(err))
    }
}

/************** stock *********** */
exports.getStock = (req, res, next) => {
    errHandler(req);
    if (req.role === "admin") {
        Stock.find({}).sort({ _id: -1 })
            .then(data => {
                if (data == null) throw new Error("something went wrong while getting stock")
                res.status(200).json({ data: "your stock is here", body: data })
            }).catch(err => next(err))
    }
}
exports.addToStock = (req, res, next) => {
    if (req.role === "admin") {

        let newStockItem = new Stock({
            product: req.body.products
        })
        newStockItem.save()
            .then(data => {
                if (data == null) throw new Error("we didn't add the item to the stock")
                res.status(201).json({ message: "added", data })
            })
    }
}
exports.updateStock = (req, res, next) => {
    if (req.role === "admin") {
        Stock.updateOne({ _id: req.body.id }, {
            $set: {
                product: req.body.products
            }
        }).then(data => {
            if (data == null) throw new Error(`we have no stock items with this id ${req.body.id}`);
            res.status(200).json({ data: "updated", body: data })
        }).catch(err => next(err))
    }
}
exports.deleteStock = (req, res, next) => {
    if (req.role === "admin") {

        Stock.deleteOne({ _id: req.body.id })
            .then(data => {
                if (data == null) throw new Error("something went wrong while deleting the stock item")
                res.status(200).json({ data: "stock item has been deleted", body: data })
            }).catch(err => next(err))
    }
}
/************** category *********** */

exports.getAllCategories = (req, res, next) => {
    // if (req.role === "admin") {

        Category.find({})
            .then(data => {
                if (data == null) throw new Error("something went wrong while getting category")
                res.status(200).json({ data: "your category is here", body: data })
            }).catch(err => next(err))
    // }
}
exports.addNewCategory = (req, res, next) => {
    errHandler(req);
    if (req.role === "admin") {

        let newCategory = new Category({
            name: req.body.categoryName,
            products: req.body.products,
        })
        newCategory.save()
            .then(data => {
                if (data == null) throw new Error("we didn't add the item to the categories")
                res.status(201).json({ message: "added", data })
            })
    }
}
exports.updateCategory = (req, res, next) => {
    if (req.role === "admin") {

        Category.updateOne({ _id: req.body.id }, {
            $set: {
                product: req.body.products
            }
        }).then(data => {
            if (data == null) throw new Error(`we have no Category with this id ${req.body.id}`);
            res.status(200).json({ data: "updated", body: data })
        }).catch(err => next(err))
    }
}
exports.deleteCategory = (req, res, next) => {
    if (req.role === "admin") {

        Category.deleteOne({ _id: req.body.id })
            .then(data => {
                if (data == null) throw new Error("something went wrong while deleting the Category")
                res.status(200).json({ data: "Category has been deleted", body: data })
            }).catch(err => next(err))
    }
}

/************** shipper *********** */
exports.getAllShippers = (req, res, next) => {
    if (req.role === "admin") {

        Shipper.find({})
            .then(data => {
                if (data == null) throw new Error("something went wrong while getting shippers")
                res.status(200).json({ data: "your category is here", body: data })
            }).catch(err => next(err))
    }
}
exports.addNewShipper = (req, res, next) => {
    errHandler(req);
    if (req.role === "admin") {

        let newShipper = new Shipper({
            name: req.body.shipperName,
            contact: {
                email: req.body.shipperEmail,
                phone_number: req.body.phoneNumber,
            },
        })
        newShipper.save()
            .then(data => {
                if (data == null) throw new Error("we didn't add the item to the shippers")
                res.status(201).json({ message: "added", data })
            })
    }
}
exports.updateShipper = (req, res, next) => {
    if (req.role === "admin") {

        Shipper.updateOne({ _id: req.body.id }, {
            $set: {
                product: req.body.products
            }
        }).then(data => {
            if (data == null) throw new Error(`we have no Shipper with this id ${req.body.id}`);
            res.status(200).json({ data: "updated", body: data })
        }).catch(err => next(err))
    }
}
exports.deleteShipper = (req, res, next) => {
    if (req.role === "admin") {

        Shipper.deleteOne({ _id: req.body.id })
            .then(data => {
                if (data == null) throw new Error("something went wrong while deleting the Shipper")
                res.status(200).json({ data: "Shipper has been deleted", body: data })
            }).catch(err => next(err))
    }
}
