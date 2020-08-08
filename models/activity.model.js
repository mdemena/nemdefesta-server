const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		from: { type: Date, required: true },
		to: { type: Date, required: true },
		location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
		likes: { type: Number, default: 0 },
		assistants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
