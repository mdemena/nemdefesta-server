const express = require('express');
const UserController = require('../controllers/user.controller');
const router = express.Router();
const uploadCloud = require('../configs/cloudinary.config.js');
const passport = require('passport');

/* GET home page. */
router.get('/', async (req, res, next) => {
	try {
		const users = await UserController.list();
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get('/:id', async (req, res, next) => {
	try {
		const user = await UserController.get(req.params.id);
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.put(
	'/:id',
	uploadCloud.single('imageAvatar'),
	async (req, res, next) => {
		const user = {
			_id: req.params.id,
			username: req.body.username,
			name: req.body.name,
			email: req.body.email,
		};
		let foundUser = await UserController.checkUsername(user.username, user._id);
		if (foundUser) {
			res.status(400).json({ message: 'Usuari existent. Utilitza un altre.' });
			return;
		} else {
			foundUser = await UserController.checkEmail(user.email, user._id);
			if (foundUser) {
				res
					.status(400)
					.json({ message: 'Correu existent. Utilitza un altre.' });
				return;
			} else {
				try {
					if (req.file) {
						user['image'] = req.file.path;
					}
					const editUser = await UserController.set(user);

					res.status(200).json(editUser);
				} catch (err) {
					res.status(500).json(err);
				}
			}
		}
	}
);
router.patch(
	'/upload/:id',
	uploadCloud.single('imageAvatar'),
	async (req, res, next) => {
		try {
			if (req.file) {
				const editUser = await UserController.setImage(
					req.params.id,
					req.file.path
				);

				res.status(200).json(editUser);
			}
		} catch (err) {
			res.status(500).json(err);
		}
	}
);
router.post('/checkemail', async (req, res, next) => {
	try {
		let exist = null;
		if (req.user) {
			exist = await UserController.checkEmail(req.body.email, req.user._id);
		} else {
			exist = await UserController.checkEmail(req.body.email);
		}
		console.log(exist);
		if (exist) {
			res.status(200).json(exist);
		} else {
			res.status(404).json({ message: 'Correu no registrat' });
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
router.post('/checkusername', async (req, res, next) => {
	try {
		let exist = null;
		if (req.user) {
			exist = await UserController.checkUsername(
				req.body.username,
				req.user._id
			);
		} else {
			exist = await UserController.checkUsername(req.body.username);
		}
		if (exist) {
			res.status(200).json(exist);
		} else {
			res.status(404).json({ message: 'Usuari disponible' });
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
