const express = require('express');
const LocationController = require('../controllers/location.controller');
const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const locations = await LocationController.list();
		res.status(200).json(locations);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get('/:id', async (req, res, next) => {
	try {
		const location = await LocationController.get(req.params.id);
		res.status(200).json(location);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.post('/', async (req, res, next) => {
	const {
		name,
		address,
		formattedAddress,
		longitude,
		latitude,
		eventId,
	} = req.body;

	if (req.isAuthenticated()) {
		try {
			const location = {
				name: name,
				address: address,
				formattedAddress: formattedAddress,
				gpsLocation: {
					coordinates: [longitude, latitude],
				},
				event: eventId,
			};

			const newLocation = await LocationController.addLocation(location);

			res.status(200).json(newLocation);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});
router.put('/:id', async (req, res, next) => {
	const { name, address, formattedAddress, longitude, latitude } = req.body;

	if (req.isAuthenticated()) {
		const location = {
			_id: req.params.id,
			name: name,
			address: address,
			formattedAddress: formattedAddress,
			gpsLocation: {
				coordinates: [longitude, latitude],
			},
		};

		const editLocation = await LocationController.set(location);

		res.status(200).json(editLocation);
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});

module.exports = router;
