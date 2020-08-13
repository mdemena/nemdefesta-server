const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		from: { type: Date, required: true },
		to: { type: Date, required: true },
		image: { type: String },
		location: {
			name: { type: String, required: true },
			address: { type: String, required: true },
			formatted_address: { type: String },
			lat: { type: Number, defaul: 0 },
			lng: { type: Number, defaul: 0 },
		},
		likes: { type: Number, default: 0 },
		assistants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
