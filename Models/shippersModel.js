const mongoose = require("mongoose");
const { Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const shippersSchema = new Schema(
	{
		_id: Number,
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		phone_number: { type: Number, required: true },
	},
	{ _id: false }
);

shippersSchema.plugin(AutoIncrement, { id: "shipper_id_counter", inc_field: "_id" });

const shipper = mongoose.model("shippers", shippersSchema);

module.exports = shipper;
