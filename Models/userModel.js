const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
	{
		_id: Number,
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
		age: {
			type: Number,
			required: true,
		},
		day: {
			type: Number,
			required: true,
		},
		month: {
			type: Number,
			required: true,
		},
		year: {
			type: Number,
			required: true,
		},
		country: { type: String, required: true },
		address: {
			city: { type: String },
			street: { type: String },
			building: { type: String },
		},
		wishlist: [
			{
				type: Number,
				ref: "product",
			},
		],
		blocked: { type: Boolean },
	},
	{ _id: false }
);

schema.plugin(autoIncrement, { id: "user-auto-increament", inc_field: "_id" });
module.exports = mongoose.model("user", schema);
