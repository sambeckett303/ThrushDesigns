var express = require('express');
var router = express.Router();

router.get('/about', async function (req, res) {
	res.render('about.html');
});

module.exports = router;