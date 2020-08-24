const Location = require('../models/location.model');
const mongoose = require('mongoose');
class LocationController {
	static async get(_id) {
		return await Location.findById(_id).populate('Event');
	}
	static async set(_location) {
		try {
			const editLocation = await Location.findByIdAndUpdate(
				_location._id,
				_location,
				{
					new: true,
				}
			);
			return editLocation;
		} catch (err) {
			console.log(err);
		}
	}
	static async addLocation(_location) {
		return await LocationController.add(
			_location.name,
			_location.address,
			_location.formattedAddress,
			_location.gpsLocation,
			_location.event
		);
	}
	static async add(_name, _address, _formattedAddress, _gpsLocation, _event) {
		try {
			const newLocation = await Location.create({
				name: _name,
				address: _address,
				formattedAddress: _formattedAddress,
				gpsLocation: _gpsLocation,
				event: _event,
			});
			return newLocation;
		} catch (err) {
			throw err;
		}
	}

	static async delete(_id) {
		const delLocation = await Location.findByIdAndRemove(_id);
		return delLocation;
	}
	static async list() {
		return await Location.find();
	}
	static async listByEvent(_event) {
		const filter = { event: _event };
		return await Location.find(filter);
	}
}
module.exports = LocationController;
