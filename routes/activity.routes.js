const express = require('express');
const ActivityController = require('../controllers/activity.controller');
const ImageController = require('../controllers/image.controller');
const router = express.Router();
const uploadCloud = require('../configs/cloudinary.config.js');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

router.get('/', async (req, res, next) => {
	try {
		const activities = await ActivityController.list();
		res.status(200).json(activities);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get('/:id', async (req, res, next) => {
	try {
		const activity = await ActivityController.get(req.params.id);
		res.status(200).json(location);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get('/event/:id', async (req, res, next) => {
	try {
		const activities = await ActivityController.listByEvent(req.params.id);
		res.status(200).json(activities);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.post(
	'/:id',
	uploadCloud.single('imageActivity'),
	async (req, res, next) => {
		if (req.isAuthenticated()) {
			const { name, description, fromDate, toDate, location } = req.body;
			try {
				const activity = {
					name,
					description,
					fromDate,
					toDate,
					location,
					event: req.params.id,
				};
				if (req.file) {
					activity['image'] = req.file.path;
				}
				const newActivity = await ActivityController.addActivity(activity);

				res.status(200).json(newActivity);
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(500).json({ message: 'No estàs autenticat' });
		}
	}
);
router.put(
	'/:id',
	uploadCloud.single('imageActivity'),
	async (req, res, next) => {
		if (req.isAuthenticated()) {
			const { name, description, fromDate, toDate, location } = req.body;
			const activity = {
				_id: req.params.id,
				name,
				description,
				fromDate,
				toDate,
				location,
			};
			if (req.file) {
				activity['image'] = req.file.path;
			}

			const editActivity = await ActivityController.set(activity);

			res.status(200).json(editLocation);
		} else {
			res.status(500).json({ message: 'No estàs autenticat' });
		}
	}
);
router.patch(
	'/upload/:id',
	uploadCloud.single('imageActivity'),
	async (req, res, next) => {
		if (req.isAuthenticated()) {
			try {
				if (req.file) {
					const editActivity = await ActivityController.setImage(
						req.params.id,
						req.file.path
					);

					res.status(200).json(editActivity);
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
			const editActivity = await ActivityController.addRemoveLike(
				req.params.id,
				req.user._id
			);
			res.status(200).json(editActivity);
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
			const editActivity = await ActivityController.addRemoveUnlike(
				req.params.id,
				req.user._id
			);
			res.status(200).json(editActivity);
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
			const editActivity = await ActivityController.addRemoveAttendee(
				req.params.id,
				req.user._id
			);
			res.status(200).json(editActivity);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});
router.patch(
	'/image/:id',
	uploadCloud.single('imageActivity'),
	async (req, res, next) => {
		if (req.isAuthenticated()) {
			try {
				const { title, description } = req.body;
				const image = {
					title,
					description,
					activity: req.params.id,
				};
				if (req.file) {
					image['image'] = req.file.path;
				}
				const newImage = await ImageController.add(image);
				res.status(200).json(ActivityController.get(req.params.id));
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(500).json({ message: 'No estàs autenticat' });
		}
	}
);
router.delete('/:id', async (req, res, next) => {
	try {
		if (req.isAuthenticated) {
			const delActivity = await ActivityController.delete(req.params.id);
			res.status(200).json(delActivity);
		} else {
			res.status(500).json({ message: 'No estàs autenticat' });
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
