const Activity = require('../models/activity.model');
const EventController = require('../controllers/event.controller');
const mongoose = require('mongoose');
class ActivityController {
	static async get(id) {
		return await Activity.findById(id).populate([
			'likes',
			'unlikes',
			'attendees',
			{
				path: 'comments',
				populate: { path: 'user' },
			},
			'images',
		]);
	}
	static async set(activity) {
		const editActivity = await Activity.findByIdAndUpdate(
			activity._id,
			activity,
			{
				new: true,
			}
		).populate(['likes', 'unlikes', 'attendees', 'comments', 'images']);
		return editActivity;
	}
	static async addActivity(activity) {
		const {
			name,
			description,
			fromDate,
			toDate,
			image,
			location,
			event,
			user,
		} = activity;
		return await ActivityController.add(
			name,
			description,
			fromDate,
			toDate,
			image,
			location,
			event,
			user
		);
	}
	static async add(
		name,
		description,
		fromDate,
		toDate,
		image,
		location,
		event,
		user
	) {
		const newActivity = await Activity.create({
			name,
			description,
			fromDate,
			toDate,
			image,
			location,
			likes: [],
			unlikes: [],
			attendees: [],
			comments: [],
			images: [],
			event,
			user,
		});
		EventController.addRemoveActivity(event, newActivity._id);
		return newActivity;
	}
	static async setImage(id, imagePath) {
		const editActivity = await Activity.findByIdAndUpdate(
			id,
			{ image: imagePath },
			{
				new: true,
			}
		).populate(['likes', 'unlikes', 'attendees', 'comments', 'images']);
		return editActivity;
	}
	static async addRemoveLike(id, user) {
		return await ActivityController.manageSubscriptions(
			id,
			user,
			'likes',
			'unlikes'
		);
	}
	static async addRemoveUnlike(id, user) {
		return await ActivityController.manageSubscriptions(
			id,
			user,
			'unlikes',
			'likes'
		);
	}
	static async addRemoveAttendee(id, user) {
		return await ActivityController.manageSubscriptions(
			id,
			user,
			'attendees',
			null
		);
	}
	static async addRemoveComment(id, comment) {
		return await ActivityController.manageSubscriptions(
			id,
			comment,
			'comments',
			null
		);
	}
	static async addRemoveImage(id, image) {
		return await ActivityController.manageSubscriptions(
			id,
			image,
			'images',
			null
		);
	}
	static async manageSubscriptions(id, document, array, contraArray) {
		const editActivity = await Activity.findById(id);
		if (editActivity) {
			if (!editActivity[array].includes(document)) {
				editActivity[array].push(document);
				if (contraArray) {
					const contraIndex = editActivity[contraArray].findIndex((doc) =>
						doc.equals(document)
					);
					if (contraIndex >= 0) {
						editActivity[contraArray].splice(contraIndex, 1);
					}
				}
			} else {
				const delIndex = editActivity[array].findIndex((doc) =>
					doc.equals(document)
				);
				if (delIndex >= 0) {
					editActivity[array].splice(delIndex, 1);
				}
			}
			await editActivity.save();
		}
		return await ActivityController.get(editActivity.id);
	}

	static async delete(id) {
		const delActivity = await Activity.findByIdAndRemove(id);
		EventController.addRemoveActivity(delActivity.event, delActivity._id);
		return delActivity;
	}
	static async listFiltered(
		fromDate,
		toDate,
		longitude,
		latitude,
		distance,
		searchText
	) {
		let filter = { fromDate: { $lt: toDate }, toDate: { $gt: fromDate } };
		if (searchText) {
			filter = {
				...filter,
				$or: [
					{ name: { $regexp: '.*' + searchText + '.*' } },
					{ 'location.address': { $regexp: '.*' + searchText + '.*' } },
				],
			};
		}
		if (longitude && latitude && distance && longitude != 0 && latitude != 0) {
			filter = {
				...filter,
				'location.gpsLocation': {
					$nearSphere: {
						$geometry: {
							type: 'Point',
							coordinates: [longitude, latitude],
						},
						$minDistance: 0,
						$maxDistance: distance * 1000,
					},
				},
			};
		}
		return await ActivityController.list(filter);
	}
	static async list(filter) {
		return await Activity.find(filter);
	}
	static async listByEvent(event) {
		const filter = { event };
		return await ActivityController.list(filter);
	}
	static async listByUser(user) {
		const filter = { user };
		return await ActivityController.list(filter);
	}
}
module.exports = ActivityController;
