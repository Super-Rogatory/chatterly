const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/messages', require('./messages'));
router.use('/rooms', require('./rooms'));

router.use((req, res, next) => {
	const err = new Error('SORRY. Could not find the information you are looking for!');
	err.status = 404;
	next(err);
});

module.exports = router;
