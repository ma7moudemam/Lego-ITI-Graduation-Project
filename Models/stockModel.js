const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
	{
		_id: Number,
        product :[{type:Number,ref:"product"}]
	},
	{ _id: false }
);

schema.plugin(autoIncrement, { id: "stockAutoIncrement", inc_field: "_id" });

module.exports = mongoose.model("stock", schema);

