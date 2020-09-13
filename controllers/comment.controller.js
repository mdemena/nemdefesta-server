const Comment = require('../models/comment.model');
const EventController = require('../controllers/event.controller');
const ActivityController = require('../controllers/activity.controller');
const mongoose = require('mongoose');

class CommentController {
	static async get(id) {
		return await Comment.findById(id).populate(['likes', 'unlikes', 'user']);
	}
	static async set(comment) {
		const editComment = await Comment.findByIdAndUpdate(comment._id, comment, {
			new: true,
		}).populate(['likes', 'unlikes', 'user']);
		return editComment;
	}
	static async addComment(comment) {
		const { title, description, event, activity, user } = comment;
		return await CommentController.add(
			title,
			description,
			event,
			activity,
			user
		);
	}
	static async add(title, description, event, activity, user) {
		const newComment = await Comment.create({
			title,
			description,
			likes: [],
			unlikes: [],
			event,
			activity,
			user,
		});
		if (event) {
			EventController.addRemoveComment(event, newComment._id);
		}
		if (activity) {
			ActivityController.addRemoveComment(activity, newComment._id);
		}

		return newComment;
	}
	static async addRemoveLike(id, user) {
		return await CommentController.manageSubscriptions(
			id,
			user,
			'likes',
			'unlikes'
		);
	}
	static async addRemoveUnlike(id, user) {
		return await CommentController.manageSubscriptions(
			id,
			user,
			'unlikes',
			'likes'
		);
	}
	static async manageSubscriptions(id, document, array, contraArray) {
		const editComment = await Comment.findById(id);
		if (editComment) {
			if (!editComment[array].includes(document)) {
				editComment[array].push(document);
				if (contraArray) {
					const contraIndex = editComment[contraArray].findIndex((doc) =>
						doc.equals(document)
					);
					if (contraIndex >= 0) {
						editComment[contraArray].splice(contraIndex, 1);
					}
				}
			} else {
				const delIndex = editComment[array].findIndex((doc) =>
					doc.equals(document)
				);
				if (delIndex >= 0) {
					editComment[array].splice(delIndex, 1);
				}
			}
		}
		await editComment.save();
		return await CommentController.get(editComment.id);
	}

	static async delete(id) {
		const delComment = await Comment.findByIdAndRemove(id);
		if (delComment.event) {
			EventController.addRemoveImage(delComment.event, delComment._id);
		}
		if (delComment.activity) {
			ActivityController.addRemoveImage(delComment.activity, delComment._id);
		}
		return delComment;
	}

	static async list(filter) {
		return await Comment.find(filter).sort('-createdAt').populate('user');
	}
	static async listByUser(user) {
		const filter = { user };
		return await CommentController.list(filter);
	}
	static async listByEvent(event) {
		const filter = { event };
		return await CommentController.list(filter);
	}
	static async listByActivity(activity) {
		const filter = { activity };
		return await CommentController.list(filter);
	}
}

module.exports = CommentController;
