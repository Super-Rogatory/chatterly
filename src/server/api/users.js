const express = require('express');
const router = express.Router();
const User = require('../db/models/Users');

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll();
        if(!users) res.status(404).send('no users in the db');
        res.send(users);        
    } catch (err) {
        next(err);
    }

});
router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if(!user) res.status(404).send('failed to find user');
        res.send(user);
    } catch (err) {
        next(err);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const user = await User.create({ name: req.body.name, room: req.body.room });
        if(!user) res.status(404).send('failed to create user');
        res.send(user);
    } catch (err) {
        next(err);
    }
})
router.delete('/:id', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if(!user) res.status(404).send('failed to find user');
        await user.destroy();
        res.send(user);
    } catch (err) {
        next(err);
    }
})

router.get('/room/:room', async (req, res, next) => {
    try {
        const users = await User.findAll({ where: { room: req.params.room }});
        res.send(users);
    } catch (err) {
        next(err);
    }
})
module.exports = router;
