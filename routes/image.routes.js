const express = require('express');
const ImageController = require('../controllers/image.controller');
const uploadCloud = require('../configs/cloudinary.config.js');
const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const images = await ImageController.list();
		res.status(200).json(images);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get('/:id', async (req, res, next) => {
	try {
		const image = await ImageController.get(req.params.id);
		res.status(200).json(image);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get('/event/:id', async (req, res, next) => {
	try {
		const images = await ImageController.listByEvent(req.params.id);
		res.status(200).json(images);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get('/activity/:id', async (req, res, next) => {
	try {
		const images = await ImageController.listByActivity(req.params.id);
		res.status(200).json(images);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.post('/', uploadCloud.single('image'), async (req, res, next) => {
	if (req.isAuthenticated()) {
		const { title, description, event, activity } = req.body;
		try {
			console.log('event', event);
			console.log('activity', activity);
			const image = {
				title,
				description,
				event,
				activity,
				user: req.user._id,
			};
			if (req.file) {
				image['image'] = req.file.path;
			}
			const newImage = await ImageController.addImage(image);

			res.status(200).json(newImage);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});
router.put('/:id', async (req, res, next) => {
	if (req.isAuthenticated()) {
		const { title, description } = req.body;
		const image = {
			_id: req.params.id,
			title,
			description,
		};

		const editImage = await ImageController.set(image);

		res.status(200).json(editImage);
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});
router.patch('/like/:id', async (req, res, next) => {
	if (req.isAuthenticated()) {
		try {
			const editImage = await ImageController.addRemoveLike(
				req.params.id,
				req.user._id
			);
			res.status(200).json(editImage);
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
			const editImage = await ImageController.addRemoveUnlike(
				req.params.id,
				req.user._id
			);
			res.status(200).json(editImage);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});
router.delete('/:id', async (req, res, next) => {
	try {
		if (req.isAuthenticated) {
			const delImage = await ImageController.delete(req.params.id);
			res.status(200).json(delImage);
		} else {
			res.status(500).json({ message: 'No estàs autenticat' });
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
