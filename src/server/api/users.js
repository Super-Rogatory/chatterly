const express = require('express');
const router = express.Router();
const User = require('../db/models/Users');

router.get('/', (req, res, next) => {
	res.send({ msg: 'Server UP!' });
});
router.post('/', async (req, res, next) => {
    try {
        const user = await User.create({ name: req.body.name, room: req.body.room });
        if(!user) res.status(401).send('failed to create user');
        res.send(user);
    } catch (err) {
        next(err);
    }
})
module.exports = router;
