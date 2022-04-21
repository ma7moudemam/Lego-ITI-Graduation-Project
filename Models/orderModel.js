const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// 1 - build schema with validation
const schema = new mongoose.Schema(
	{
		_id: Number,
		user: { type: Number, required: true, ref: "user" },
		shipper: { type: Number, ref: "shippers" },
		isPending: { type: Boolean },
		withShipper: { type: Boolean },
		isShipped: { type: Boolean },
		isDelivered: { type: Boolean },
		isCanceled: { type: Boolean },
		order_date: String,
		total_price: String,
		products: [
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
