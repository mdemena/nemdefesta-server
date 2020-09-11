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
router.get('/event/:id', async (req, res, next) => {
	try {
		const locations = await LocationController.listByEvent(req.params.id);
		res.status(200).json(locations);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.post('/', async (req, res, next) => {
	if (req.isAuthenticated()) {
		const {
			name,
			address,
			formattedAddress,
			longitude,
			latitude,
			event,
		} = req.body;
		try {
			const location = {
				name,
				address,
				formattedAddress,
				gpsLocation: {
					coordinates: [longitude, latitude],
				},
				event: event,
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
	if (req.isAuthenticated()) {
		const { name, address, formattedAddress, longitude, latitude } = req.body;
		const location = {
			_id: req.params.id,
			name,
			address,
			formattedAddress,
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
router.delete('/:id', async (req, res, next) => {
	try {
		if (req.isAuthenticated) {
			const delLocation = await LocationController.delete(req.params.id);
			res.status(200).json(delLocation);
		} else {
			res.status(500).json({ message: 'No estàs autenticat' });
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
