var express = require('express');
var SectionStoreManager = require('../models/SectionStoreManager.js');
var router = express.Router();

// Simple route middleware to ensure user is authenticated.
function ensureAdminAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.admin) { return next(); }
  res.redirect('/signin');
};


router.post('/section', ensureAdminAuthenticated, async function (req, res) {
	const result = await SectionStoreManager.addSection(req.body);
	res.json({
		id: result
	});
});

router.put('/section', ensureAdminAuthenticated, async function (req, res) {
	// TODO: see if this works
	const result = await SectionStoreManager.updateSection(req.body);
	res.sendStatus(200);
});

router.delete('/section', ensureAdminAuthenticated, async function (req, res) {
	const result = await SectionStoreManager.deleteSection(req.body.id);
	if (result)
		res.sendStatus(200);
	else
		res.sendStatus(400);
});

module.exports = router;