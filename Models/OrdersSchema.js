const mongoose = require("mongoose");

const AutoIncrement = require('mongoose-sequence')(mongoose);

// 1 - build schema with validation 
const schema = new mongoose.Schema({
    _id: Number,
    user: { type: mongoose.Schema.Types.String, ref: "user" },
    shipers: { type: Number, ref: "shipers" },
    order_status: Number,
    tax: Number,
    payment: Number,
    order_date: Date,

}, { _id: false })

schema.plugin(AutoIncrement, { id: "eventAutoIncrement", inc_field: "_id" });



// 2 - register for schema in mongoose

module.exports = mongoose.model("Orders", schema);