const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const schema = new mongoose.Schema(
	{
		_id: Number,
		user: { type: String, ref: "user" },
		card_number: { type: Number, min: 16, max: 16, required: true },
		exp_year: { type: Number, min: 2, max: 2 },
		exp_month: { type: Number, min: 2, max: 2 },
		CVV: { type: Number, min: 3, max: 3 },
	},
	{ _id: false }
);

schema.plugin(autoIncrement, { id: "paymentAutoIncrement", inc_field: "_id" });
module.expots = mongoose.model("payment", schema);
