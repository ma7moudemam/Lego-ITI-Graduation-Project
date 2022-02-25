const mongoose = require('mongoose')
const autoIncrement = require('mongoose-sequence')(mongoose);

const schema = new mongoose.Schema({
    _id: Number,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: [{
        country: { type: String, required:true},
        city: { type: String, required:true},
        street:  { type: String, required:true},
        building:  { type: Number, required:true},
        postal_code:  { type: Number, required:true}
    }],
    wishlist: {
        type: Number,
        ref: "wishlist"
    },
    cart: {
        type: Number,
        ref: "cart"
    },
    review: {
        type: Number,
        ref: "review"
    },
    payment: {
        type: Number,
        ref: "payment"
    },
    orders: {
        type: Number,
        ref: "orders"
    }

}, { _id: false })

schema.plugin(autoIncrement, { id: "user-auto-increament", inc_field: "_id" })
module.exports = mongoose.model("user", schema)