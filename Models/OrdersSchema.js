const mongoose = require("mongoose");

const AutoIncrement = require('mongoose-sequence')(mongoose);

// 1 - build schema with validation 
const schema = new mongoose.Schema({
    _id: Number,
    user: { type: String, ref: "user" },
    shippers: { type: Number, ref: "shippers" },
    order_status: Number,
    tax: Number,
    payment: Number,
    order_date: Date,
    product: [{
        product: { type: Number, ref: "product" },
        product_number: Number,
        unit_price: Number,
    }]
}, { _id: false })

schema.plugin(AutoIncrement, { id: "eventAutoIncrement", inc_field: "_id" });



// 2 - register for schema in mongoose

module.exports = mongoose.model("Orders", schema);