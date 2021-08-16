const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.send({ msg: 'Server UP!' });
});

module.exports = router;
