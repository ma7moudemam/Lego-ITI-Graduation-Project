const mongoose = require("mongoose");
const categoryAutoInc = require('mongoose-sequence')(mongoose);

const categoryModel = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: true },
})

categoryModel.plugin(categoryAutoInc, { id: "categoryAutoIncrement", inc_field: "_id" });
module.exports = mongoose.model("category", categoryModel)