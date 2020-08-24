const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		address: { type: String, required: true },
		formattedAddress: { type: String },
		gpsLocation: {
			type: { type: String, default: 'Point' },
			coordinates: [{ type: Number }],
		},
		event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
	},
	{ timestamps: true }
);

const Location = mongoose.model('Location', eventSchema);

module.exports = Location;
