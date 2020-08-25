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
		from: { type: Date, required: true },
		to: { type: Date, required: true },
		image: { type: String },
		location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
		likes: { type: Number, default: 0 },
		assistants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
		event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
	},
	{ timestamps: true }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
