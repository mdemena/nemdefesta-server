const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		type: {
			type: String,
			default: 'Local Activity',
			enum: ['Local Activity', 'Music Concert', 'Sport play'],
		},
		fromDate: { type: Date, required: true },
		toDate: { type: Date, required: true },
		image: { type: String },
		location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
		images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
			required: true,
		},
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
