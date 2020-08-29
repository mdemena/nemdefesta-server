const Event = require('../models/event.model');
const Comment = require('../models/comment.model');
const Location = require('../models/location.model');
const Activity = require('../models/activity.model');
const Image = require('../models/image.model');
const User = require('../models/user.model');

const mongoose = require('mongoose');
class EventController {
	static async get(id) {
		return await Event.findById(id).populate([
			'locations',
			'activities',
			'likes',
			'unlikes',
			'attendees',
			'comments',
			'images',
		]);
	}
	static async set(event) {
		try {
			const editEvent = await Event.findByIdAndUpdate(event._id, event, {
				new: true,
			}).populate([
				'locations',
				'activities',
				'likes',
				'unlikes',
				'attendees',
				'comments',
				'images',
			]);
			return editEvent;
		} catch (err) {
			console.log(err);
		}
	}
	static async addEvent(event) {
		const {
			name,
			description,
			fromDate,
			toDate,
			image,
			location,
			user,
		} = event;
		return await EventController.add(
			name,
			description,
			fromDate,
			toDate,
			image,
			location,
			user
		);
	}
	static async add(name, description, fromDate, toDate, image, location, user) {
		const newEvent = await Event.create({
			name,
			description,
			fromDate,
			toDate,
			image,
			location,
			locations: [],
			activities: [],
			likes: [],
			unlikes: [],
			attendees: [],
			comments: [],
			images: [],
			user,
		});
		return newEvent;
	}
	static async setImage(id, imagePath) {
		try {
			const editEvent = await Event.findByIdAndUpdate(
				id,
				{ image: imagePath },
				{
					new: true,
				}
			).populate([
				'locations',
				'activities',
				'likes',
				'unlikes',
				'attendees',
				'comments',
				'images',
			]);
			return editEvent;
		} catch (err) {
			throw err;
		}
	}
	static async addRemoveLocation(id, location) {
		try {
			return await EventController.manageSubscriptions(
				id,
				location,
				'locations',
				null
			);
		} catch (err) {
			throw err;
		}
	}
	static async addRemoveActivity(id, activity) {
		try {
			return await EventController.manageSubscriptions(
				id,
				activity,
				'activities',
				null
			);
		} catch (err) {
			throw err;
		}
	}
	static async addRemoveLike(id, user) {
		try {
			return await EventController.manageSubscriptions(
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
			return await EventController.manageSubscriptions(
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
			return await EventController.manageSubscriptions(
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
			return await EventController.manageSubscriptions(
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
			return await EventController.manageSubscriptions(
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
		try {
			const editEvent = await Event.findById(id);
			if (editEvent) {
				if (!editEvent[array].includes(document)) {
					editEvent[array].push(document);
					if (contraArray) {
						const contraIndex = editEvent[contraArray].findIndex((doc) =>
							doc.equals(document)
						);
						if (contraIndex >= 0) {
							editEvent[contraArray].splice(contraIndex, 1);
						}
					}
				} else {
					const delIndex = editEvent[array].findIndex((doc) =>
						doc.equals(document)
					);
					if (delIndex >= 0) {
						editEvent[array].splice(delIndex, 1);
					}
				}
			}
			await editEvent.save();
			return await EventController.get(editEvent.id);
		} catch (err) {
			throw err;
		}
	}

	static async delete(id) {
		const delEvent = await Event.findByIdAndRemove(id);
		return delEvent;
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
		return await EventController.list(filter);
	}
	static async list(filter) {
		console.log('Filter: ', filter);
		return await Event.find(filter);
	}
	static async listByUser(user) {
		const filter = { user: user };
		return await EventController.list(filter);
	}
}
module.exports = EventController;
