const express = require('express');
const router = express.Router();
const path = require('path');
const Message = require('../db/models/Messages');
const User = require('../db/models/Users');
const Room = require('../db/models/Rooms');
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
		const messages = await Room.getMessagesByRoom(req.params.room);
		if (!messages) res.status(404).send('no messages found!');
		res.send(messages);
	} catch (err) {
		next(err);
	}
});

router.post('/', async (req, res, next) => {
	const message = await Message.create({ text: req.body.message });
	if (!message) res.status(404).send('unable to create message');

	// both users and chatbots have room properties
	const room = await Room.findOne({ where: { name: req.body.user.room } });
	if (!room) res.status(404).send('room error');

	// a regular sendMessage event would work, if the user is a chatbot change functionality as chatbot's id's differ from user's
	// a chatbot can have id 4, and a user can have id 5 such that all previous ids don't exist (if guest, it is deleted)
	if (req.body.user && req.body.user.name !== 'chatbot') {
		try {
			// our original user object could not use magic methods, so we made another user based on that id and became a wizard then.
			const user = await User.findByPk(req.body.user.id);
			if (!user) {
				res.send({ err: true });
				return;
			}
			// associate user with message as normal, not necessary for chatbot
			else await user.addMessage(message);
		} catch (err) {
			next(err);
		}
	}
	await room.addMessage(message);
	res.status(200).send(message);
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
