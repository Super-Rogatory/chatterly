const express = require('express');
const router = express.Router();
const Room = require('../db/models/Rooms');

router.get('/:id', async (req, res, next) => {
	try {
		const room = await Room.findOne({ where: { id: req.params.id } });
		console.log(Object.keys(room.__proto__));
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
module.exports = router;
