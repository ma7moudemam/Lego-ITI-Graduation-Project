const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const blacklistSchema = new mongoose.Schema(
	{
		_id: Number,
		user: { type: String, unique: true, required: true, ref: "user" },
	},
	{ _id: false }
);

blacklistSchema.plugin(AutoIncrement, { id: "blacklist_id_counter", inc_field: "_id" });

const blacklist = mongoose.model("blacklist", blacklistSchema);

module.exports = blacklist;
