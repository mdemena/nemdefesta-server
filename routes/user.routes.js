const express = require('express');
const UserController = require('../controllers/user.controller');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uploadCloud = require('../configs/cloudinary.config.js');

/* GET home page. */
router.get('/', async (req, res, next) => {
	try {
		const users = await UserController.list();
		res.statusCode(200);
		res.json(users);
	} catch (err) {
		res.statusCode(500);
		res.json(err);
	}
});
router.post('/', uploadCloud.single('imageAvatar'), async (req, res, next) => {
	const user = ({ email, name, password, googleToken } = req.body);
	try {
		if (req.file) {
			user['imagePath'] = req.file.path;
		}
		user['passwordHash'] = await bcrypt.hashSync(password, 10);
		const newUser = await UserController.add(user);

		res.statusCode(200);
		res.json(newUser);
	} catch (err) {
		res.statusCode(500);
		res.json(err);
	}
});
router.put(
	'/:id',
	uploadCloud.single('imageAvatar'),
	async (req, res, next) => {
		const user = { _id: req.params.id, name: req.body.name };
		try {
			if (req.file) {
				user['imagePath'] = req.file.path;
			}
			const passwordHash = await bcrypt.hashSync(password, 10);
			const newUser = await UserController.set(user);

			res.statusCode(200);
			res.json(newUser);
		} catch (err) {
			res.statusCode(500);
			res.json(err);
		}
	}
);
module.exports = router;
