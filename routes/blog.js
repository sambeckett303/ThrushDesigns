var express = require('express');
var BlogStoreManager = require('../models/BlogStoreManager.js');
var router = express.Router();

// Simple route middleware to ensure user is authenticated.
function ensureAdminAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.admin) { return next(); }
  res.redirect('/signin');
};

router.get('/blog', async function (req, res) {
	const blogPreviews = await BlogStoreManager.getBlogPreviews();
	const blogTitles = await BlogStoreManager.getBlogTitles();
	res.render('blog.html', { blogs: blogPreviews, blogTitles: blogTitles });
});

router.get('/blog/:name', async function (req, res) {
	const blog = await BlogStoreManager.getBlog(req.params.name);
	res.render('blogPost.html', { blog: blog });
});

// Add Blog Post
router.post('/blog', ensureAdminAuthenticated, async function (req, res) {
	const storeResp = await BlogStoreManager.addBlogPost(req.body.title);
	res.json({
		id: storeResp
	});
});

// Update Blog Post
router.put('/blog', ensureAdminAuthenticated, function (req, res) {
	const storeResp = BlogStoreManager.updateBlogPost(req.body);
	res.sendStatus(200);
});

// Delete Blog Post
router.delete('/blog', ensureAdminAuthenticated, function (req, res) {
	const storeResp = BlogStoreManager.deleteBlogPost(req.body.title);
	res.sendStatus(200);
});

module.exports = router;