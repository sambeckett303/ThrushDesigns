var express = require('express');
var SectionStoreManager = require('../models/SectionStoreManager.js');
var router = express.Router();

router.get('/work', async function (req, res) {
	// TODO: error handling when can't connect to db
	const sectionsResult = await SectionStoreManager.getSections();
	res.render('work.html', { sections: sectionsResult });
});

module.exports = router;