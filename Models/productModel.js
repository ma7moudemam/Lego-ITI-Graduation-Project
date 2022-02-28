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
		category: { type: Number, ref: "category" },
	},
	{ _id: false }
);

// function to fetch random products
productModel.statics.random = async function () {
	let randomDocArr = []
	let i = 0;
	const count = await this.count();
	const rand = Math.floor(Math.random() * count);
	const randomDoc = await this.findOne().skip(rand);
	while (i <= 6) {
		randomDocArr.push(randomDoc)
		i++;
	}
	return randomDocArr;
};


productModel.plugin(productAutoInc, { id: "productAutoIncrement", inc_field: "_id" });
module.exports = mongoose.model("product", productModel);
