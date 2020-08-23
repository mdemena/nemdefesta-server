const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		type: {
			type: String,
			default: 'Local Event',
			enum: ['Local Event', 'Music Concert', 'Sport play'],
		},
		fromDate: { type: Date, required: true },
		toDate: { type: Date, required: true },
		image: { type: String },
		location: {
			name: { type: String, required: true },
			address: { type: String, required: true },
			formatted_address: { type: String },
			gpsLocation: {
				type: { type: String, default: 'Point' },
				coordinates: [{ type: Number }],
			},
		},
		likes: { type: Number, default: 0 },
		assistants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
