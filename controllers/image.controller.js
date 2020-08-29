const Image = require('../models/image.model');
const EventController = require('../controllers/event.controller');
const ActivityController = require('../controllers/activity.controller');
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
		const { title, description, image, event, activity, user } = _image;

		return await ImageController.add(
			title,
			description,
			image,
			event,
			activity,
			user
		);
	}
	static async add(title, description, image, event, activity, user) {
		const newImage = await Image.create({
			title,
			description,
			image,
			event,
			activity,
			user,
			likes: [],
			unlikes: [],
		});
		if (event) {
			await EventController.addRemoveImage(event, newImage._id);
		}
		if (activity) {
			await ActivityController.addRemoveImage(activity, newImage._id);
		}
		return newImage;
	}

	static async delete(id) {
		const delImage = await Image.findByIdAndRemove(id);
		if (delImage.event) {
			await EventController.addRemoveImage(delImage.event, delImage._id);
		}
		if (delImage.activity) {
			await ActivityController.addRemoveImage(delImage.activity, delImage._id);
		}
		return delImage;
	}
	static async list(filter) {
		return await Image.find(filter);
	}
	static async listByUser(user) {
		const filter = { user };
		return await ImageController.list(filter);
	}
	static async listByEvent(event) {
		const filter = { event };
		return await ImageController.list(filter);
	}
	static async listByActivity(activity) {
		const filter = { activity };
		return await ImageController.list(filter);
	}
}
module.exports = ImageController;
