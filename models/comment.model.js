const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		likes: { type: Number, default: 0 },
		event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
		activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
