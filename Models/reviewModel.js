const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const schema = new mongoose.Schema(
	{
		_id: { type: Number, required: true },
		user: { type: String, ref: "user", required: true },
		product: { type: Number, ref: "product", required: true },
		date: { type: Date, required: true },
		rating: { type: Number, required: true },
		comment: { type: String, required: true },
	},
	{ _id: false }
);

schema.plugin(autoIncrement, { id: "reviewAutoIncrement", inc_field: "_id" });
module.expots = mongoose.model("review", schema);
