const User = require("./../Models/userModel");

//for testing purposes
const useremail = "essamm65@yahoo.com"
const password = "123mm"

exports.getWishlist = (req, res, next) => {
    User.findOne({ email: useremail })
        .then(data => {
            if (data == null) throw new Error("sign in first")
            res.status(200).json({ data: "your wish list is here", wishlist: data.wishlist })
        })
        .catch(err => next(err))
}


exports.updateWishlist = (req, res, next) => {
    User.findOne({ email: useremail })
        .then(data => {
            if (data == null) throw new Error("sign in first")
            if (data.wishlist.includes(req.body.wishlist)) throw new Error("it's already in your wishlist")
            User.updateOne({ email: useremail }, {
                $addToSet: { wishlist: req.body.wishlist }
            }).then(data => {
                if (data == null) throw new Error(`we have no product like this`)
                res.status(200).json({ data: "added to wishlist", wishlist: data })
            })
        })
        .catch(err => next(err))
}
// feature to empty the wishlist with one click
exports.deleteFromWishlist = (req, res, next) => {
    // the user must be signed in
    User.findOne({ email: useremail })
        .then(data => {
            if (data == null) throw new Error("sign in first")
            User.updateOne({ email: useremail }, {
                $pull: { wishlist: req.body.wishlist }
            }).then(data => {
                if (data == null) throw new Error(`we have no product like this`)
                if (data.modifiedCount) throw new Error("this product is already removed from your wishlist")
                res.status(200).json({ data: "removed from wishlist", wishlist: data })
            })
        }).catch(err => next(err))
}
// exports.deleteFromWishlist = (req, res, next) => {
//     User.findOne({ email: useremail })
//         .then(data => {
//             if (data == null) throw new Error("sign in first")
//             if (data.wishlist.includes(req.body.wishlist)) {
//                 User.updateOne({ email: useremail }, {
//                     $pull: { wishlist: req.body.wishlist }
//                 }).then(data => {
//                     if (data == null) throw new Error(`we have no product like this`)
//                     res.status(200).json({ data: "removed from wishlist", wishlist: data })
//                 })
//             }
//             res.status(404).json({data:"this product is not in your wishlist"})
//         }).catch(err => next(err))
// }
