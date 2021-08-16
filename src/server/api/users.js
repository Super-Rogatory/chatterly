const express = require('express');
const router = express.Router();
const User = require('../db/models/Users');

router.get('/', (req, res, next) => {
	res.send({ msg: 'Server UP!' });
});
router.post('/', (req, res, next) => {
    
})
module.exports = router;
