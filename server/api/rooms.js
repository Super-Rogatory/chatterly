const express = require('express');
const router = express.Router();
const Room = require('../db/models/Rooms');
const User = require('../db/models/Users');

router.get('/:id', async (req, res, next) => {
	try {
		const room = await Room.findOne({ where: { id: req.params.id } });
		if (!room) res.status(404).send('could not find room');
		res.send(room);
	} catch (err) {
		next(err);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const room = await Room.findOne({ where: { name: req.body.name } });
		if (room) {
			// if room already exists return that room to front end
			const chatBot = await room.getChatBot();
			res.send({ room, isExisting: true, chatBot });
		} else {
			// else create a new room. after room is created chatbot is associated to room
			const newRoom = await Room.create({ name: req.body.name });
			const chatBot = await newRoom.getChatBot();
			if (!newRoom) res.status(404).send('room was unable to be created');
			else res.send({ room: newRoom, isExisting: false, chatBot });
		}
	} catch (err) {
		next(err);
	}
});

router.put('/', async (req, res, next) => {
	try {
		if (req.body.user) {
			const room = await Room.findOne({ where: { name: req.body.user.room } });
			const user = await User.findOne({ where: { name: req.body.user.name } });
			if (room) {
				//populates our participants table, not necessary for chatbot, should be done elsewhere
				await room.addUser(user);
				res.status(200).json('successfully associated room and user');
			}
		}
	} catch (err) {
		next(err);
	}
});
module.exports = router;
