const express = require('express');
const router = express.Router();
const Message = require('../db/models/Messages');

router.get('/', async (req, res, next) => {
    try {
        const messages = await Message.findAll();
        if(!messages) res.status(404).send('no messages found!');
        res.send(messages);
    } catch (err) {
        next(err);
    }
})
router.post('/', async (req, res, next) => {
    try {
        const message = await Message.create({ text: req.body.message });
        if(!message) res.status(404).send('unable to create message');
        res.send(message);
    } catch (err) {
        next(err);
    }
})


module.exports = router;