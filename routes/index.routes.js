const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
	res.send('Welcome to in-events API');
});

module.exports = router;
