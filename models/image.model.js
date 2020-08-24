const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
	{
		title: { type: String },
		description: { type: String },
		image: { type: String, required: true },
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
