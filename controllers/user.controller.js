const User = require('../models/user.model');
const mongoose = require('mongoose');
class UserController {
	static async get(_id) {
		return await User.findById(_id);
	}
	static async set(_user) {
		try {
			const editUser = await User.findByIdAndUpdate(_user._id, _user, {
				new: true,
			});
			return editUser;
		} catch (err) {
			console.log(err);
		}
	}
	static async add(username, name, email, password) {
		try {
			const newUser = await User.create({ username, name, email, password });
			return newUser;
		} catch (err) {
			throw err;
		}
	}
	static async setImage(_id, _imagePath) {
		try {
			const editUser = await User.findByIdAndUpdate(
				_id,
				{ image: _imagePath },
				{
					new: true,
				}
			);
			return editUser;
		} catch (err) {
			throw err;
		}
	}
	static async delete(_id) {
		const delUser = await User.findByIdAndRemove(_id);
		return delUser;
	}
	static async list() {
		return await User.find();
	}
	static async findByEmail(_email) {
		return await User.findOne({ email: _email });
	}
	static async findByUsername(_username) {
		return await User.findOne({ username: _username });
	}
	static async checkEmail(_email) {
		return await User.findOne({ email: _email });
	}
	static async checkEmail(_email, _id) {
		return await User.findOne({
			email: { $eq: _email },
			_id: { $ne: _id },
		});
	}
	static async checkUsername(_username) {
		return await User.findOne({ username: _username });
	}
	static async checkUsername(_username, _id) {
		return await User.findOne({
			username: { $eq: _username },
			_id: { $ne: _id },
		});
	}
}
module.exports = UserController;
