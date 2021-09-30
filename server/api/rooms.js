const express = require('express');
const router = express.Router();
const Room = require('../db/models/Rooms');

router.post('/', async (req, res, next) => {
	try {
		const room = await Room.findOne({ where: { name: req.body.name } });
		if (room) {
			// if room already exists return that room to front end
			res.send({ room, isExisting: true });
		} else {
			// else create a new room
			const newRoom = await Room.create({ name: req.body.name });
			if (!newRoom) res.status(404).send('room was unable to be created');
			else res.send({ room: newRoom, isExisting: false });
		}
	} catch (err) {
		next(err);
	}
});
module.exports = router;
