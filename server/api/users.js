const express = require('express');
const router = express.Router();
const User = require('../db/models/Users');

router.get('/', async (req, res, next) => {
	try {
		const users = await User.findAll();
		if (!users) res.status(404).send('no users in the db');
		else res.send(users);
	} catch (err) {
		next(err);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const user = await User.findByPk(req.params.id);
		if (!user) res.status(404).send('failed to find user');
		else res.send(user);
	} catch (err) {
		next(err);
	}
});

router.get('/misc/getUserCount', async (req, res, next) => {
	try {
		const count = await User.getActiveUserCount();
		if (!count) res.status(200).send({ count: 0 });
		else res.send({ count });
	} catch (err) {
		next(err);
	}
});

router.post('/misc/decreaseUserCount', async (req, res, next) => {
	try {
		const user = await User.findOne({ where: { name: req.body.name } });
		if (!user) {
			res.status(404).send('failed to find user');
			return;
		} else {
			user.active = false;
			user.save();
			res.status(200).send({ success: true });
		}
	} catch (err) {
		next(err);
	}
});

router.get('/misc/:name', async (req, res, next) => {
	try {
		const user = await User.findOne({ where: { name: req.params.name } });
		if (!user) res.send(false);
		else res.send(true);
	} catch (err) {
		next(err);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const user = await User.create({ name: req.body.name, room: req.body.room });
		if (!user) res.status(404).send('failed to create user');
		else res.send(user);
	} catch (err) {
		next(err);
	}
});
router.delete('/:id', async (req, res, next) => {
	try {
		const user = await User.findByPk(req.params.id);
		if (!user) {
			res.status(404).send('failed to find user');
			throw new Error('failed to find user');
		} else {
			await user.destroy();
			res.send(user);
		}
	} catch (err) {
		next(err);
	}
});

router.get('/room/:room', async (req, res, next) => {
	try {
		const users = await User.findAll({ where: { room: req.params.room } });
		res.send(users);
	} catch (err) {
		next(err);
	}
});
module.exports = router;

// NOTE: express handles 404's no need to throw new Error object.
