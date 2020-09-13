const Event = require('../models/event.model');
const Comment = require('../models/comment.model');
const Location = require('../models/location.model');
const Activity = require('../models/activity.model');
const Image = require('../models/image.model');
const User = require('../models/user.model');
const EscapeStringRegExp = require('escape-string-regexp');
const mongoose = require('mongoose');
class EventController {
	static async get(id) {
		return await Event.findById(id).populate([
			'locations',
			{
				path: 'activities',
				populate: [
					{ path: 'comments', populate: { path: 'user' } },
					{ path: 'location' },
				],
			},

			'likes',
			'unlikes',
			// {
			// 	path: 'attendees',
			// 	populate: { path: 'user' },
			// },
			{
				path: 'comments',
				populate: { path: 'user' },
			},
			{
				path: 'images',
				populate: { path: 'user' },
			},
		]);
	}
	static async set(event) {
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
	}
	static async addRemoveLocation(id, location) {
		return await EventController.manageSubscriptions(
			id,
			location,
			'locations',
			null
		);
	}
	static async addRemoveActivity(id, activity) {
		return await EventController.manageSubscriptions(
			id,
			activity,
			'activities',
			null
		);
	}
	static async addRemoveLike(id, user) {
		return await EventController.manageSubscriptions(
			id,
			user,
			'likes',
			'unlikes'
		);
	}
	static async addRemoveUnlike(id, user) {
		return await EventController.manageSubscriptions(
			id,
			user,
			'unlikes',
			'likes'
		);
	}
	static async addRemoveAttendee(id, user) {
		return await EventController.manageSubscriptions(
			id,
			user,
			'attendees',
			null
		);
	}
	static async addRemoveComment(id, comment) {
		return await EventController.manageSubscriptions(
			id,
			comment,
			'comments',
			null
		);
	}
	static async addRemoveImage(id, image) {
		return await EventController.manageSubscriptions(id, image, 'images', null);
	}
	static async manageSubscriptions(id, document, array, contraArray) {
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
	}

	static async delete(id) {
		const delEvent = await Event.findByIdAndRemove(id);
		return delEvent;
	}
	static async listFiltered(
		fromDate,
		toDate,
		searchText,
		longitude,
		latitude,
		distance
	) {
		let filter = {
			fromDate: { $lt: toDate },
			toDate: { $gt: fromDate },
		};
		// console.log(searchText);
		// if (searchText) {
		// 	const $regex = '\b' + EscapeStringRegExp(searchText);
		// 	filter = {
		// 		...filter,
		// 		name: { $regex, $options: 'i' },
		// 	};
		// }
		//console.log(filter);
		// if (searchText) {
		// 	filter = {
		// 		...filter,
		// 		$or: [
		// 			{ name: { $regexp: '.*' + searchText + '.*' } },
		// 			{ 'location.address': { $regexp: '.*' + searchText + '.*' } },
		// 		],
		// 	};
		// }
		// if (longitude && latitude && distance && longitude != 0 && latitude != 0) {
		// 	filter = {
		// 		...filter,
		// 		'location.gpsLocation': {
		// 			$nearSphere: {
		// 				$geometry: {
		// 					type: 'Point',
		// 					coordinates: [longitude, latitude],
		// 				},
		// 				$minDistance: 0,
		// 				$maxDistance: distance * 1000,
		// 			},
		// 		},
		// 	};
		// }
		return await EventController.list(filter);
	}
	static async list(filter) {
		console.log('Filter: ', filter);
		return await Event.find(filter)
			.sort('fromDate')
			.populate({
				path: 'comments',
				populate: { path: 'user' },
			});
	}
	static async listByUser(user) {
		const filter = { user: user };
		return await EventController.list(filter);
	}
	static async listByAttendee(user) {
		const filter = { attendees: user };
		return await EventController.list(filter);
	}
}
module.exports = EventController;
