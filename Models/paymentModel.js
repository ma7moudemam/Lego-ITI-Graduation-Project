const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const schema = new mongoose.Schema(
	{
		_id: { type: Number, required: true },
		user: { type: String, ref: "user", required: true },
		card_number: { type: Number, min: 16, max: 16, unique: true, required: true },
		exp_year: { type: Number, min: 2, max: 2, required: true },
		exp_month: { type: Number, min: 2, max: 2, required: true },
		CVV: { type: Number, min: 3, max: 3, required: true },
	},
	{ _id: false }
);

schema.plugin(autoIncrement, { id: "paymentAutoIncrement", inc_field: "_id" });
module.expots = mongoose.model("payment", schema);
