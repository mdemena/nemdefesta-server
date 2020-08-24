const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
