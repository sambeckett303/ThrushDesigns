var express = require('express');
var ProductsStoreManager = require('../models/ProductsStoreManager.js');
var router = express.Router();

// Simple route middleware to ensure user is authenticated.
function ensureAdminAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.admin) { return next(); }
  res.redirect('/signin');
};


router.post('/product', ensureAdminAuthenticated, async function (req, res) {
	const result = await ProductsStoreManager.addProduct(req.body);
	if (result)
	{
		res.json({
			id: result
		});
		return;
	}
	// TODO: test & handle this client side
	res.sendStatus(400);
});

router.put('/product', ensureAdminAuthenticated, function (req, res) {
	// TODO: see if this works
	const result = ProductsStoreManager.updateProduct(req.body);
	if (result)
		res.sendStatus(200);
	else
		res.sendStatus(400);
});

router.delete('/product', ensureAdminAuthenticated, function (req, res) {
	const result = ProductsStoreManager.deleteProduct(req.body.id);
	if (result)
		res.sendStatus(200);
	else
		res.sendStatus(400);
});

router.get('/product', function (req, res) {
	const result = ProductsStoreManager.getProducts();
	if (result)
	{
		res.json(
		{
			products: result
		});
	}
});

module.exports = router;