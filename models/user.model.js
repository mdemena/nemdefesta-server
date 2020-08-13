const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		passwordHash: { type: String, required: true },
		image: {
			type: String,
			default:
				'https://cdn2.vectorstock.com/i/1000x1000/20/76/man-avatar-profile-vector-21372076.jpg',
		},
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
