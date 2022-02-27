const mongoose = require("mongoose");
const productAutoInc = require("mongoose-sequence")(mongoose);

const productModel = new mongoose.Schema(
	{
		_id: Number,
		name: { type: String, required: true },
		// images: [{ type: String, required: true }],
		price: { type: Number, required: true },
		amount: { type: Number, required: true },
		sold: { type: Number, required: true },
		rating: { type: Number },
	},
	{ _id: false }
);

<<<<<<< HEAD
// function to fetch random product
productModel.statics.random = async function () {
	let randomDocArr = []
	const count = await this.count();
	const rand = Math.floor(Math.random() * count);
	const randomDoc = await this.findOne().skip(rand);
	randomDocArr.push(randomDoc)
	return randomDocArr;
};


=======
>>>>>>> 9eb6275fe3ee5520c71ed0d88a3da0ad79857477
productModel.plugin(productAutoInc, { id: "productAutoIncrement", inc_field: "_id" });
module.exports = mongoose.model("product", productModel);
