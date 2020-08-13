const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		address: { type: String, required: true },
		formatted_address: { type: String },
		lat: { type: Number, default: 0 },
		lng: { type: Number, default: 0 },
		event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
	},
	{ timestamps: true }
);

const Location = mongoose.model('Location', eventSchema);

module.exports = Location;
