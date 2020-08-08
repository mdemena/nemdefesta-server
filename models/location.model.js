const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		address: { type: String, required: true },
		formatted_address: { type: String },
		lat: { type: Number, default: 0 },
		lng: { type: Number, default: 0 },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

const Location = mongoose.model('Location', eventSchema);

module.exports = Location;
