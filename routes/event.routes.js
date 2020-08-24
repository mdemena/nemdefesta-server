const express = require('express');
const EventController = require('../controllers/event.controller');
const router = express.Router();
const uploadCloud = require('../configs/cloudinary.config.js');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

router.get('/', async (req, res, next) => {
	try {
		let { fromDate, toDate, lng, lat, distance } = req.query;

		if (fromDate) {
			console.log('Query From: ', fromDate);
			fromDate = dayjs(new Date(fromDate));
		} else {
			fromDate = dayjs();
		}

		if (toDate) {
			toDate = dayjs(new Date(toDate));
		} else {
			toDate = dayjs(fromDate).add(1, 'month');
		}

		let events = await EventController.listByDates(
			fromDate.toDate(),
			toDate.toDate()
		);
		if (lng && lat) {
			events = EventController.listByDatesAndLocation(
				fromDate.toDate(),
				toDate.toDate(),
				lng,
				lat,
				distance === undefined ? 100 : distance
			);
		}
		res.status(200).json(events);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get('/:id', async (req, res, next) => {
	try {
		const user = await EventController.get(req.params.id);
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.post('/', uploadCloud.single('imageEvent'), async (req, res, next) => {
	const {
		name,
		description,
		fromDate,
		toDate,
		locationName,
		locationAddress,
		locationFormattedAddress,
		locationCoordinatesLng,
		locationCoordinatesLat,
	} = req.body;

	if (req.isAuthenticated()) {
		const event = {
			name,
			description,
			fromDate: new Date(fromDate),
			toDate: new Date(toDate),
			location: {
				name: locationName,
				address: locationAddress,
				formattedAddress: locationFormattedAddress,
				gpsLocation: {
					coordinates: [locationCoordinatesLng, locationCoordinatesLat],
				},
			},
			user: req.user._id,
		};

		try {
			if (req.file) {
				event['image'] = req.file.path;
			}
			const newEvent = await EventController.addEvent(event);

			res.status(200).json(newEvent);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});
router.put('/:id', uploadCloud.single('imageEvent'), async (req, res, next) => {
	const {
		name,
		description,
		fromDate,
		toDate,
		locationName,
		locationAddress,
		locationFormattedAddress,
		locationCoordinatesLng,
		locationCoordinatesLat,
	} = req.body;

	if (req.isAuthenticated()) {
		const event = {
			_id: req.params.id,
			name,
			description,
			fromDate: new Date(fromDate),
			toDate: new Date(toDate),
			location: {
				name: locationName,
				address: locationAddress,
				formattedAddress: locationFormattedAddress,
				gpsLocation: {
					type: 'Point',
					coordinates: [locationCoordinatesLng, locationCoordinatesLat],
				},
			},
		};

		if (req.file) {
			event['image'] = req.file.path;
		}
		const editEvent = await EventController.set(event);

		res.status(200).json(editEvent);
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});
router.patch(
	'/upload/:id',
	uploadCloud.single('imageEvent'),
	async (req, res, next) => {
		if (req.isAuthenticated()) {
			try {
				if (req.file) {
					const editEvent = await EventController.setImage(
						req.params.id,
						req.file.path
					);

					res.status(200).json(editEvent);
				}
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(500).json({ message: 'No estàs autenticat' });
		}
	}
);
router.patch('/like/:id', async (req, res, next) => {
	if (req.isAuthenticated()) {
		try {
			const editEvent = await EventController.like(req.params.id, req.user._id);
			res.status(200).json(editEvent);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});
router.patch('/unlike/:id', async (req, res, next) => {
	if (req.isAuthenticated()) {
		try {
			const editEvent = await EventController.unlike(
				req.params.id,
				req.user._id
			);
			res.status(200).json(editEvent);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});
router.patch('/attendee/:id', async (req, res, next) => {
	if (req.isAuthenticated()) {
		try {
			const editEvent = await EventController.attendee(
				req.params.id,
				req.user._id
			);
			res.status(200).json(editEvent);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});
module.exports = router;
