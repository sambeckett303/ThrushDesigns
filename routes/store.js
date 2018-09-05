var express = require('express');
var ProductsStoreManager = require('../models/ProductsStoreManager.js');
var router = express.Router();

router.get('/store', async function (req, res) {
	// TODO: error handling when can't connect to db
	const productsResult = await ProductsStoreManager.getProducts();
	res.render('store.html', { products: productsResult });
});

module.exports = router;