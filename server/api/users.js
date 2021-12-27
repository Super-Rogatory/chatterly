const express = require('express');
const router = express.Router();
const User = require('../db/models/Users');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const { issueJWT, authMiddleware } = require('../auth/utils');
require('dotenv').config();

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

router.get('/misc/:name', async (req, res, next) => {
	try {
		const user = await User.findOne({ where: { name: req.params.name } });
		if (!user) res.send(false);
		else res.send(true);
	} catch (err) {
		next(err);
	}
});

router.get('/misc/getUserByName/:name', async (req, res, next) => {
	try {
		const user = await User.findOne({ where: { name: req.params.name }, attributes: ['id', 'name', 'room', 'active'] });
		if (!user) res.status(404).send('failed to find user');
		else res.send(user);
	} catch (err) {
		next(err);
	}
});

router.post('/misc/updateUserStatus', async (req, res, next) => {
	try {
		const user = await User.findOne({ where: { name: req.body.name } });
		if (!user) {
			res.status(404).send('failed to find user');
			return;
		} else {
			user.active = user.active ? false : true;
			user.save();
			res.status(200).send({ success: true });
		}
	} catch (err) {
		next(err);
	}
});

router.post('/misc/testingValidToken', authMiddleware, (req, res, next) => {
	res.send({ status: true });
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

router.post(
	'/register',
	[check('password', 'Password must be longer than eight characters').isLength({ min: 8 })],
	async (req, res, next) => {
		try {
			const userFromDb = await User.findOne({ where: { name: req.body.username } });
			const errors = validationResult(req);

			if (!errors.isEmpty() || userFromDb || !req.body.username || !req.body.password) {
				return res.status(404).send('something went wrong');
			}
			const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS);
			const hash = await bcrypt.hash(req.body.password, salt);
			const user = await User.create({ name: req.body.username, isGuest: false, active: false, salt, hash });
			res.send(user);
		} catch (err) {
			next(err);
		}
	}
);

router.post('/login', async (req, res, next) => {
	try {
		if (!req.body.username) {
			return res.json({ msg: 'Whoops! You forget to add a username!', isUserValid: false, errorType: 'nameError' });
		}
		const userFromDb = await User.findOne({ where: { name: req.body.username } });
		// if there is not user existing in the db, or if the user that exists in the db is a guest, throw name error.
		if (!userFromDb) {
			return res.json({ msg: 'Account does not exist!', isUserValid: false, errorType: 'nameError' });
		}
		if (userFromDb.isGuest) {
			return res.json({
				msg: 'This username is already taken by a guest.',
				isUserValid: false,
				errorType: 'nameError',
			});
		}
		const isValidPassword = await bcrypt.compare(req.body.password, userFromDb.hash);
		if (!isValidPassword) {
			return res.json({
				msg: 'Invalid username or password!',
				isUserValid: false,
				errorType: 'passwordError',
			});
		}
		// the user is not authenticate and can be active.
		userFromDb.active = true;
		await userFromDb.save();
		const tokenObject = issueJWT(userFromDb);
		res.send({ tokenObj: tokenObject, isUserValid: true });
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

module.exports = router;

// NOTE: express handles 404's no need to throw new Error object.
