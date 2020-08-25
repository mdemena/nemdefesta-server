const Location = require('../models/location.model');
const mongoose = require('mongoose');
class LocationController {
	static async get(id) {
		return await Location.findById(id).populate('Event');
	}
	static async set(location) {
		try {
			const editLocation = await Location.findByIdAndUpdate(
				location._id,
				location,
				{
					new: true,
				}
			);
			return editLocation;
		} catch (err) {
			console.log(err);
		}
	}
	static async addLocation(location) {
		const { name, address, formattedAddress, gpsLocation, event } = location;
		return await LocationController.add(
			name,
			address,
			formattedAddress,
			gpsLocation,
			event
		);
	}
	static async add(name, address, formattedAddress, gpsLocation, event) {
		try {
			const newLocation = await Location.create({
				name,
				address,
				formattedAddress,
				gpsLocation,
				event,
			});
			return newLocation;
		} catch (err) {
			throw err;
		}
	}

	static async delete(id) {
		const delLocation = await Location.findByIdAndRemove(id);
		return delLocation;
	}
	static async list(filter) {
		return await Location.find(filter);
	}
	static async listByEvent(event) {
		const filter = { event };
		return await LocationController.list(filter);
	}
}
module.exports = LocationController;
