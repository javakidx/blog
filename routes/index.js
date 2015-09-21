var crypto = require('crypto'),
	User = require('../models/user.js');
//var express = require('express');
//var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

//module.exports = router;
module.exports = function(app)
{
	app.get('/', function(req, res)
	{
		res.render('index', {title : 'Express'});
	});
	app.get('/nswbmw', function(req, res)
	{
		res.render('nswbmw');
	});
	app.get('/login', function(req, res){
		res.render('login', {title:'login'});
	});
	app.post('/login', function(req, res){});

	app.get('/register', function(req, res){
		res.render('register', {title:'Register'});
	});
}
