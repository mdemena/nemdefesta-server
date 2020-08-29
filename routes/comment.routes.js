const express = require('express');
const CommentController = require('../controllers/comment.controller');
const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const comments = await CommentController.list();
		res.status(200).json(comments);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get('/:id', async (req, res, next) => {
	try {
		const comment = await CommentController.get(req.params.id);
		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get('/event/:id', async (req, res, next) => {
	try {
		const comments = await CommentController.listByEvent(req.params.id);
		res.status(200).json(comments);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get('/activity/:id', async (req, res, next) => {
	try {
		const comments = await CommentController.listByActivity(req.params.id);
		res.status(200).json(comments);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.post('/', async (req, res, next) => {
	if (req.isAuthenticated()) {
		const { title, description, event, activity } = req.body;
		try {
			const comment = {
				title,
				description,
				event,
				activity,
				user: req.user._id,
			};

			const newComment = await CommentController.addComment(comment);

			res.status(200).json(newComment);
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
		const comment = {
			_id: req.params.id,
			title,
			description,
		};

		const editComment = await CommentController.set(comment);

		res.status(200).json(editComment);
	} else {
		res.status(500).json({ message: 'No estàs autenticat' });
	}
});
router.patch('/like/:id', async (req, res, next) => {
	if (req.isAuthenticated()) {
		try {
			const editComment = await CommentController.addRemoveLike(
				req.params.id,
				req.user._id
			);
			res.status(200).json(editComment);
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
			const editComment = await CommentController.addRemoveUnlike(
				req.params.id,
				req.user._id
			);
			res.status(200).json(editComment);
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
			const delComment = await CommentController.delete(req.params.id);
			res.status(200).json(delComment);
		} else {
			res.status(500).json({ message: 'No estàs autenticat' });
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
