const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const schema = new mongoose.Schema(
	{
		_id: Number,
		user: { type: String, ref: "user" },
		product: { type: Number, ref: "product" },
		date: Date,
		rating: Number,
		comment: String,
	},
	{ _id: false }
);

schema.plugin(autoIncrement, { id: "reviewAutoIncrement", inc_field: "_id" });
module.expots = mongoose.model("review", schema);
