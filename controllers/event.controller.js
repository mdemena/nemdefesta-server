const Event = require('../models/event.model');
const mongoose = require('mongoose');
class EventController {
	static async get(_id) {
		return await Event.findById(_id)
			.populate('assistants.User')
			.populate('Comment');
	}
	static async set(_event) {
		try {
			const editEvent = await Event.findByIdAndUpdate(_event._id, _event, {
				new: true,
			});
			return editEvent;
		} catch (err) {
			console.log(err);
		}
	}
	static async addEvent(_event) {
		return await EventController.add(
			_event.name,
			_event.description,
			_event.fromDate,
			_event.toDate,
			_event.image ? _event.image : null,
			_event.location,
			_event.user
		);
	}
	static async add(
		_name,
		_description,
		_fromDate,
		_toDate,
		_image,
		_location,
		_user
	) {
		try {
			const newEvent = await Event.create({
				name: _name,
				description: _description,
				fromDate: _fromDate,
				toDate: _toDate,
				image: _image,
				location: _location,
				likes: [],
				unlikes: [],
				attendees: [],
				user: _user,
			});
			return newEvent;
		} catch (err) {
			throw err;
		}
	}
	static async setImage(_id, _imagePath) {
		try {
			const editEvent = await Event.findByIdAndUpdate(
				_id,
				{ image: _imagePath },
				{
					new: true,
				}
			);
			return editEvent;
		} catch (err) {
			throw err;
		}
	}
	static async like(_id, _user) {
		try {
			return await EventController.manageSubscriptions(
				_id,
				_user,
				'likes',
				'unlikes'
			);
		} catch (err) {
			throw err;
		}
	}
	static async unlike(_id, _user) {
		try {
			return await EventController.manageSubscriptions(
				_id,
				_user,
				'unlikes',
				'likes'
			);
		} catch (err) {
			throw err;
		}
	}
	static async attendee(_id, _user) {
		try {
			return await EventController.manageSubscriptions(
				_id,
				_user,
				'attendees',
				null
			);
		} catch (err) {
			throw err;
		}
	}
	static async manageSubscriptions(_id, _user, _array, _contraArray) {
		try {
			const editEvent = await EventController.get(_id);
			if (editEvent) {
				if (!editEvent[_array].includes(_user)) {
					editEvent[_array].push(_user);
					if (_contraArray) {
						const contraIndex = editEvent[_contraArray].findIndex((user) =>
							user.equals(_user)
						);
						if (contraIndex >= 0) {
							editEvent[_contraArray].splice(contraIndex, 1);
							console.log('Removed user in contra: ', contraIndex);
						}
					}
				} else {
					const delIndex = editEvent[_array].findIndex((user) =>
						user.equals(_user)
					);
					if (delIndex >= 0) {
						editEvent[_array].splice(delIndex, 1);
					}
				}
			}
			return await editEvent.save();
		} catch (err) {
			throw err;
		}
	}

	static async delete(_id) {
		const delEvent = await Event.findByIdAndRemove(_id);
		return delEvent;
	}
	static async list() {
		return await Event.find();
	}
	static async listByDates(_fromDate, _toDate) {
		const filter = { fromDate: { $lt: _toDate }, toDate: { $gt: _fromDate } };
		return await Event.find(filter);
	}
	static async listByLocation(_lng, _lat, _distance) {
		const filter = {
			'location.gpsLocation': {
				$nearSphere: {
					$geometry: {
						type: 'Point',
						coordinates: [_lng, _lat],
					},
					$minDistance: 0,
					$maxDistance: _distance * 1000,
				},
			},
		};
		return await Event.find(filter);
	}
	static async listByDatesAndLocation(_from, _to, _lng, _lat, _distance) {
		console.log('Form: ', _from);
		console.log('To: ', _to);
		console.log('Longitud: ', _lng);
		console.log('Latitud: ', _lat);
		console.log('Distance: ', _distance);
		const filter = {
			fromDate: {
				$lt: _to,
			},
			toDate: {
				$gt: _from,
			},
			'location.gpsLocation': {
				$nearSphere: {
					$geometry: {
						type: 'Point',
						coordinates: [_lng, _lat],
					},
					$minDistance: 0,
					$maxDistance: _distance * 1000,
				},
			},
		};
		return await Event.find(filter);
	}
	static async listByUser(_user) {
		return await Event.find({ user: _user });
	}
}
module.exports = EventController;
