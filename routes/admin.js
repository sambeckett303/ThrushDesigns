var express = require('express');
var SectionStoreManager = require('../models/SectionStoreManager.js');
var BlogStoreManager = require('../models/BlogStoreManager.js');
var ProductsStoreManager = require('../models/ProductsStoreManager.js');
var router = express.Router();

// Simple route middleware to ensure user is authenticated.
function ensureAdminAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.admin) { return next(); }
  res.redirect('/signin');
};

router.get('/admin', ensureAdminAuthenticated, async function (req, res) {
	let pageData = { };
	const sectionsResult = await SectionStoreManager.getSections();
	const blogResult = await BlogStoreManager.getBlogTitlesAndContent();
	const productsResult = await ProductsStoreManager.getProducts();
	// TODO: Add error handling to these request, pass the success/error into the callback
	if (sectionsResult)
	{
		pageData.sections = sectionsResult;
	}
	if (blogResult)
	{
		pageData.blogs = blogResult;
	}
	if (productsResult)
	{
		pageData.products = productsResult;
	}
	res.render('admin.html', pageData);
});

module.exports = router;