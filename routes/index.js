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
	app.post('/register', function(req, res){
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
	
		if (password != password_re)
		{
			req.flash('error', 'The password must be the same');
			return res.redirect('/'); //redirect to the register page
		}

		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');

		var newUser = new User({
			name : req.body.name,
			password : password,
			email : req.body.email
		});

		User.get(newUser.name, function(err, user){
			if (user)
			{
				req.flash('error', 'The user existed');
				return res.redirect('/register');
			}
			console.log('User not found');
		});

		newUser.save(function(err, user){
			if (err)
			{
				req.flash('error', err);
				return res.redirect('/register');
			}

			req.session.user = user;
			req.flash('success', 'Register success');
			res.redirect('/');
		});
	});
}
