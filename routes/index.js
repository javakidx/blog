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
		//res.render('index', {title : 'Express'});
		res.render('index', {
			title : '主頁',
			user : req.session.user,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});
	app.get('/login', function(req, res){
		res.render('login', {title:'login'});
	});
	app.post('/login', function(req, res){
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');

		User.get(req.body.name, function(err, user){
			if (!user)
			{
				req.flash('error', '用戶不存在');
				return res.redirect('/login');
			}
			
			//檢查密碼
			if (user.password != password)
			{
				req.flash('error', '密碼錯誤！');
				return res.redirect('/login');
			}
			req.session.user = user;
			req.flash('success', '登入成功');
			res.redirect('/');
		});
	});

	app.get('/register', function(req, res){
		//res.render('register', {title:'Register'});
		res.render('register', {
			title : '註冊', 
			user :req.session.user,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
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
				req.flash('error', '用戶已存在');
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
			req.flash('success', '註冊成功！');
			res.redirect('/');
		});
	});
	app.get('/logout', function(req, res){
		req.session.user = null;
		req.flash('success', '登出成功');
		res.redirect('/');
	});
}
