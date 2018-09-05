var express = require('express');
var SectionStoreManager = require('../models/SectionStoreManager.js');
var BlogStoreManager = require('../models/BlogStoreManager.js');
var aws = require('aws-sdk');
var router = express.Router();

// Simple route middleware to ensure user is authenticated.
function ensureAdminAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.admin) { return next(); }
  res.redirect('/signin');
};

router.get('/sign-s3', ensureAdminAuthenticated, function (req, res) {
	var s3 = new aws.S3();
	var fileName = req.query['file-name'];
	var fileType = req.query['file-type'];
	// Figure out a unique filename
    var ext = fileName.split('.').pop();
    var random = Math.floor(Math.random() * 900000000000000000);
    fileName = random + '.' + ext;

	var s3Params = {
		Bucket: process.env.S3_BUCKET_NAME,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: 'public-read'
	};

	s3.getSignedUrl('putObject', s3Params, function (err, data) {
		if(err) {
		  console.log(err);
		  return res.end();
		}
		var url = 'https://' + process.env.S3_BUCKET_NAME + '.s3.amazonaws.com/' + fileName;
		var returnData = {
		  signedRequest: data,
		  url: url
		};
		res.write(JSON.stringify(returnData));
		res.end();
	});
});

router.delete('/image', ensureAdminAuthenticated, function (req, res) {
    var s3 = new aws.S3();
    // TODO: substring out the "thrush designs" part, this substring could be for dynamic scooters ?
    if (req.body.url)
    {
        var requestParams =
        {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: req.body.url.substring(39)
        };
        s3.deleteObject(requestParams,
        function(err, data)
        {
            if (err)
            {
                console.log(err)
            }
            else
            {
                // TODO: delete this?
                console.log(data);
                res.sendStatus(200);
            }
        });
    }
    else if (req.body.urlArray)
    {
        var objects = [];
        for(var i = 0; i < req.body.urlArray.length; i++)
        {
            objects.push({Key : req.body.urlArray[i].substring(39) });
        }
        var options = {
            Bucket: process.env.S3_BUCKET_NAME,
            Delete: {
                Objects: objects
            }
        };
        s3.deleteObjects(options, function(err, data) {
            if (err)
            {
                console.log(err)
            }
            else
            {
                // TODO: delete this?
                console.log(data);
                res.sendStatus(200);
            }
        });
    }
});

module.exports = router;