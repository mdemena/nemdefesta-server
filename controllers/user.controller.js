const User = require('../models/user.model');

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
	static async add(_user) {
		try {
			const newUser = await User.create(_user);
			return newUser;
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
}
module.exports = UserController;
