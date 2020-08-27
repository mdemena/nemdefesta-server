const Activity = require('../models/activity.model');
const EventController = require('../controllers/event.controller');
const mongoose = require('mongoose');
class ActivityController {
	static async get(id) {
		return await Activity.findById(id).populate([
			'likes',
			'unlikes',
			'attendees',
			'comments',
			'images',
		]);
	}
	static async set(activity) {
		try {
			const editActivity = await Activity.findByIdAndUpdate(
				activity._id,
				activity,
				{
					new: true,
				}
			).populate(['likes', 'unlikes', 'attendees', 'comments', 'images']);
			return editActivity;
		} catch (err) {
			console.log(err);
		}
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
		try {
			const editEvent = await Event.findByIdAndUpdate(
				id,
				{ image: imagePath },
				{
					new: true,
				}
			).populate(['likes', 'unlikes', 'attendees', 'comments', 'images']);
			return editEvent;
		} catch (err) {
			throw err;
		}
	}
	static async addRemoveLike(id, user) {
		try {
			return await ActivityController.manageSubscriptions(
				id,
				user,
				'likes',
				'unlikes'
			);
		} catch (err) {
			throw err;
		}
	}
	static async addRemoveUnlike(id, user) {
		try {
			return await ActivityController.manageSubscriptions(
				id,
				user,
				'unlikes',
				'likes'
			);
		} catch (err) {
			throw err;
		}
	}
	static async addRemoveAttendee(id, user) {
		try {
			return await ActivityController.manageSubscriptions(
				id,
				user,
				'attendees',
				null
			);
		} catch (err) {
			throw err;
		}
	}
	static async addRemoveComment(id, comment) {
		try {
			return await ActivityController.manageSubscriptions(
				id,
				comment,
				'comments',
				null
			);
		} catch (err) {
			throw err;
		}
	}
	static async addRemoveImage(id, image) {
		try {
			return await ActivityController.manageSubscriptions(
				id,
				image,
				'images',
				null
			);
		} catch (err) {
			throw err;
		}
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
		}
		await editActivity.save();
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
	static async listByUser(user) {
		const filter = { user: user };
		return await ActivityController.list(filter);
	}
}
module.exports = ActivityController;
