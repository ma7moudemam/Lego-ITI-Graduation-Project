const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
	{
		_id: Number,
		total_price: { type: Number, required: true },
		product: [{ type: Number, ref: "product" }],
		user: { type: String, ref: "user" },
	},
	{ _id: false }
);

schema.plugin(autoIncrement, { id: "cartAutoIncrement", inc_field: "_id" });

module.exports = mongoose.model("cart", schema);
