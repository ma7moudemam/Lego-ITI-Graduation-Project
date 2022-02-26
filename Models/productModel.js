const mongoose = require("mongoose");
const productAutoInc = require("mongoose-sequence")(mongoose);

const productModel = new mongoose.Schema(
	{
		_id: Number,
		name: { type: String, required: true },
		images: [{ type: String, required: true }],
		price: { type: Number, required: true },
		amount: { type: Number, required: true },
		sold: { type: Number, required: true },
		rating: { type: Number },
	},
	{ _id: false }
);

productModel.plugin(productAutoInc, { id: "productAutoIncrement", inc_field: "_id" });
module.exports = mongoose.model("product", productModel);
