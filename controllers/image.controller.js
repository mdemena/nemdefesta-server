const Image = require('../models/image.model');
const mongoose = require('mongoose');
class ImageController {
	static async get(id) {
		return await Image.findById(id);
	}
	static async set(image) {
		try {
			const editImage = await Image.findByIdAndUpdate(image._id, image, {
				new: true,
			});
			return editImage;
		} catch (err) {
			console.log(err);
		}
	}
	static async addImage(_image) {
		const { title, description, image, user } = _image;
		return await ImageController.add(title, description, image, user);
	}
	static async add(title, description, image, user) {
		try {
			const newImage = await Image.create({
				title,
				description,
				image,
				user,
				likes: [],
				unlikes: [],
			});
			return newImage;
		} catch (err) {
			throw err;
		}
	}

	static async delete(id) {
		const delImage = await Image.findByIdAndRemove(id);
		return delImage;
	}
	static async list(filter) {
		return await Image.find(filter);
	}
}
module.exports = ImageController;
