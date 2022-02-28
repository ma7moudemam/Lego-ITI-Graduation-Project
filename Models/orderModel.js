const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// 1 - build schema with validation
const schema = new mongoose.Schema(
	{
		_id: Number,
		user: { type: String, ref: "user" },
		shipper: { type: Number, ref: "shippers" },
		order_status: Number,
		tax: Number,
		payment: { type: Number, ref: "payment" },
		order_date: String,
		product: [
			{
				product: { type: Number, ref: "product" },
				quantity: Number,
				unit_price: Number,
			},
		],
	},
	{ _id: false }
);

schema.plugin(AutoIncrement, { id: "orderAutoIncrement", inc_field: "_id" });

// 2 - register for schema in mongoose

module.exports = mongoose.model("orders", schema);
