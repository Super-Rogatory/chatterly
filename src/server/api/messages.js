const express = require('express');
const router = express.Router();
const Message = require('../db/models/Messages');
const User = require('../db/models/Users');
router.get('/', async (req, res, next) => {
	try {
		const messages = await Message.findAll();
		if (!messages) res.status(404).send('no messages found!');
		res.send(messages);
	} catch (err) {
		next(err);
	}
});
router.get('/:room', async (req, res, next) => {
	try {
		const messages = await Message.findAll({
			where: {
				room: req.params.room,
			},
		});
		if (!messages) res.status(404).send('no messages found!');
		res.send(messages);
	} catch (err) {
		next(err);
	}
});
router.post('/', async (req, res, next) => {
	if (req.body.user) {
		try {
			// our original user object could not use magic methods, so we made another user based on that id and became a wizard then.
			const message = await Message.create({ text: req.body.message, room: req.body.user.room });
			if (!message) res.status(404).send('unable to create message');
			const user = await User.findByPk(req.body.user.id);
			await user.addMessage(message);
			res.send(message);
		} catch (err) {
			next(err);
		}
	} else {
		try {
			const message = await Message.create({ text: req.body.message });
			if (!message) res.status(404).send('unable to create message');
			res.send(message);
		} catch (err) {
			next(err);
		}
	}
});

module.exports = router;
/*
[
  '_customGetters',    '_customSetters',
  'validators',        '_hasCustomGetters',
  '_hasCustomSetters', 'rawAttributes',
  '_isAttribute',      'getMessages',
  'countMessages',     'hasMessage',
  'hasMessages',       'setMessages',
  'addMessage',        'addMessages',
  'removeMessage',     'removeMessages',
  'createMessage'
]
[
  '_customGetters',
  '_customSetters',
  'validators',
  '_hasCustomGetters',
  '_hasCustomSetters',
  'rawAttributes',
  '_isAttribute',
  'getUser',
  'setUser',
  'createUser'
]
*/
