var express = require('express');
var SectionStoreManager = require('../models/SectionStoreManager.js');
var router = express.Router();

// Simple route middleware to ensure user is authenticated.
function ensureAdminAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.admin) { return next(); }
  res.redirect('/signin');
};


router.post('/section', ensureAdminAuthenticated, function (req, res) {
	const result = SectionStoreManager.addSection(req.body);
	if (result)
		res.sendStatus(200);
	else
		// TODO: test & handle this client side
		res.sendStatus(400);
});

router.put('/section', ensureAdminAuthenticated, function (req, res) {
	// TODO: see if this works
	const result = SectionStoreManager.updateSection(req.body);
	if (result)
		res.sendStatus(200);
	else
		res.sendStatus(400);
});

router.delete('/section', ensureAdminAuthenticated, function (req, res) {
	const result = SectionStoreManager.deleteSection(req.body.id);
	if (result)
		res.sendStatus(200);
	else
		res.sendStatus(400);
});

module.exports = router;