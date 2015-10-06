var crypto = require('crypto'),
	User = require('../models/user.js'),
	Post = require('../models/post.js'),
	Comment = require('../models/comment.js');
var React = require('react'),
	request = require('request');
var jsx = require('node-jsx');
jsx.install();

var Books = require('../views/index.jsx');
var YouBikeSiteList = require('../views/YouBikeSiteList.jsx');
//var express = require('express');
//var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

//module.exports = router;
module.exports = function(app)
{
	app.get('/youbike/:pg', function(req, res){
		console.log(req.body);
		var pageSize = 20,
			offset = (req.params.pg ? parseInt(req.params.pg) - 1 : 0) * pageSize;
		console.log('offset: ' + offset);
		request('http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=ddb80380-f1b3-4f8e-8016-7ed9cba571d5&limit=' + pageSize + '&offset=' + offset, 
				function(err, response, body){
					if (err)
					{
						console.error(err);
					}
					else if(response.statusCode == 200)
					{
						//data = body;
						var data = JSON.parse(body),
							sites = data.result.results ||[];
						//console.log(body);
						
						//res.render('apiTest', {dataSet : data});
						//res.setHeader('Content-Type', 'text/html');

						var htmlPeice = React.renderToStaticMarkup(
									React.DOM.div({
										id: 'container',
										className : 'container',
										style : {'margin-top' : '50px'},
										dangerouslySetInnerHTML: {
											__html: React.renderToString(React.createElement(YouBikeSiteList, {
												siteList: sites
											}))
										}
									})
								);
						// var htmlPeice = React.renderToStaticMarkup(
						// 		React.DOM.html(
						// 			null, 
						// 			React.DOM.head(
						// 			 	null,
						// 			 	React.DOM.link({
						// 			 		'type' : 'text/css',
						// 			 		'rel' : 'stylesheet',
						// 			 		'href' : 'css/bootstrap.min.css'
						// 			 	})
						// 			 ),
						// 			React.DOM.body(
						// 				null,
						// 				React.DOM.div({
						// 					id: 'container',
						// 					dangerouslySetInnerHTML: {
						// 						__html: React.renderToString(React.createElement(YouBikeSiteList, {
						// 							siteList: sites
						// 						}))
						// 					}
						// 				}),
						// 				React.DOM.script({
						// 					'type': 'text/javascript',
						// 					'src': 'js/jquery.min.js'
						// 				}),
						// 				React.DOM.script({
						// 					'type': 'text/javascript',
						// 					'src': 'js/bootstrap.min.js'
						// 				})
						// 			)
				  // 				)
						// 	);
						//res.end(htmlPeice); //render all html with React
						//console.log(htmlPeice);
						res.render('myLayout',{
							title : 'YouBike',
							htmlPeice : htmlPeice
						});	
					}
					else
					{
						return res.redirect('/');
					}
		});
	});
	app.get('/react', function(req, res){
		console.log('abc');
//		res.redirect('/');
		var books = [{
				title: 'Professional Node.js',
				read: false
			}, {
				title: 'Node.js Patterns',
				read: true
		}];

		res.setHeader('Content-Type', 'text/html');
		res.end(React.renderToStaticMarkup(
			React.DOM.body(
					null,
					React.DOM.div({
						id: 'container',
						dangerouslySetInnerHTML: {
							__html: React.renderToString(React.createElement(Books, {
								books: books
							}))
						}
					}),
				React.DOM.script({
					'id': 'initial-data',
					'type': 'text/plain',
					'data-json': JSON.stringify(books)
				}),
				React.DOM.script({
					src: '/bundle.js'
				})
			)
  		));	
	});
	app.get('/helloReact', function(req, res){
		res.render('helloReact', {
			title : '喲! React.js'
		});
	});
	app.get('/', function(req, res)
	{
		var page = req.body.p ? parseInt(req.body.p) : 1;

		// Post.getAll(null, function(err, posts)
		// {
		// 	if (err)
		// 	{
		// 		posts = [];
		// 	}
		// 	res.render('index', {
		// 		title : '主頁',
		// 		user : req.session.user,
		// 		posts : posts,
		// 		success : req.flash('success').toString(),
		// 		error : req.flash('error').toString()
		// 	});
		// });

		Post.getTen(null, page, function(err, posts, total){
			if (err)
			{
				console.error(err);
				posts = [];
			}

			res.render('index', {
				title : '',
				posts : posts,
				page : page,
				isFirstPage : (page - 1) == 0,
				isLastPage : ((page - 1) * 10 + posts.length) == total,
				user : req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString()
			});
		});
	});
	app.get('/register', checkNotLogin);
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
			req.flash('error', '兩次輸入的密碼不一致!');
			return res.redirect('/register'); //redirect to the register page
		}

		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');

		var newUser = new User({
			name : req.body.name,
			password : password,
			email : req.body.email
		});

		User.get(newUser.name, function(err, user){
			if (err)
			{
				req.flash('error', err);
				return res.redirect('/');
			}
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
	app.get('/login', checkNotLogin);
	app.get('/login', function(req, res){
		res.render('login', {
			title:'登入',
			user : req.session.user,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});
	app.post('/login', checkNotLogin);
	app.post('/login', function(req, res){
		console.log('start to verify...');
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
	app.get('/post', checkLogin);
	app.get('/post', function(req, res){
		res.render('post', {
			title : '發表文章',
			user : req.session.user,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});	
	});
	app.post('/post', checkLogin);
	app.post('/post', function(req, res){
		var currentUser = req.session.user,
			post = new Post(currentUser.name, req.body.title, req.body.post);
		post.save(function(err){
			if (err)
			{
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '發佈成功');
			res.redirect('/'); //回到首頁
		});	
	});
	app.get('/logout', checkLogin);
	app.get('/logout', function(req, res){
		req.session.user = null;
		req.flash('success', '登出成功');
		res.redirect('/');
	});
	
	app.get('/upload', checkLogin);
	app.get('/upload', function(req, res){
		res.render('upload', {
			title : '檔案上傳',
			user : req.session.user,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});
	app.post('/upload', checkLogin);
	app.post('/upload', function(req, res){
		req.flash('success', '檔案上傳成功');
		res.redirect('/upload');
	});

	app.get('/u/:name', function(req, res){
		User.get(req.params.name, function(err, user){
			if (!user)
			{
				req.flash('error', '用戶不存在!');
				return res.redirect('/');
			}

			// Post.getAll(user.name, function(err, posts){
			// 	if (err)
			// 	{
			// 		req.flash('error', err);
			// 		return res.redirect('/');
			// 	}
			// 	res.render('user', {
			// 		title : user.name,
			// 		posts : posts,
			// 		user : req.session.user,
			// 		success : req.flash('success').toString(),
			// 		error : req.flash('error').toString()
			// 	});
			// });
			var page = req.body.p ? parseInt(req.body.p) : 1;
			Post.getTen(user.name, page, function(err, posts, total){
				if (err)
				{
					req.flash('error', err);
					return res.redirect('/');
				}

				res.render('user', {
					title : user.name,
					posts : posts,
					page : page,
					isFirstPage : (page - 1) == 0,
					isLastPage : ((page - 1) * 10 + posts.length) == total,
					user : req.session.user,
					success : req.flash('success').toString(),
					error : req.flash('error').toString()
				});
			});
		});
	});
	app.get('/u/:name/:day/:title', function(req, res){
		Post.getOne(req.params.name, req.params.day, req.params.title, function(err, post){
			if (err)
			{
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('article', {
				title : req.params.title,
				post : post,
				user : req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString()
			});
		});
	});
	
	app.post('/u/:name/:day/:title', function(req, res){
		var date = new Date(),
			time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + 
					date.getDate() + " " + date.getHours() + ":" + 
					(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

		var comment = {
			name : req.body.name,
			email : req.body.email,
			website : req.body.website,
			time : time,
			content : req.body.content
		};
		
		var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
		newComment.save(function(err){
			if (err)
			{
				console.error(err);
				req.flash('error', err);
				return res.redirect('back');
			}
			req.flash('success', '留言成功！');
			res.redirect('back');
		});
	});
	app.get('/edit/:name/:day/:title', checkLogin);
	app.get('/edit/:name/:day/:title', function(req, res){
		var currentUser = req.session.user;
		Post.edit(req.params.name, req.params.day, req.params.title, function(err, post){
			if (err)
			{
				req.flash('error', err);
				return res.redircet('back');
			}
			res.render('edit', {
				title : '編輯',
				post : post,
				user :  currentUser,
				success : req.flash('success').toString(),
				error : req.flash('error').toString()
			});
		});
	});
	
	app.post('/edit/:name/:day/:title', checkLogin);
	app.post('/edit/:name/:day/:title', function(req, res){
		var currentUser = req.session.user;
		Post.update(req.params.name, req.params.day, req.params.title, req.body.post, function(err){
			var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
			if (err)
			{
				req.flash('error', err);
				return res.redirect('url');
			}
			req.flash('success', '修改成功!');
			res.redirect(url);
		});
	});
	
	//刪除
	app.get('remove/:name/:day/:title', checkLogin);
	app.get('remove/:name/:day/:title', function(req, res){
		var currentUser = req.session.user;
		Post.remove(req.params.name, req.params.day, req.params.title, function(err){
			console.log('here');
			if (err)
			{
				console.log(err);
				req.flash('error', err);
				return res.redirect('back');
			}
			req.flash('success', '刪除成功!');
			res.redirect('/');
		});
	});
	
	function checkLogin(req, res, next)
	{
		if (!req.session.user)
		{
			res.flash('error', '未登入!');
			res.redirect('/login');
		}
		next();
	}
	
	function checkNotLogin(req, res, next)
	{
		console.log(req.session.user);
		if (req.session.user)
		{
			req.flash('error', '已登入!');
			res.redirect('back');
		}
		next();
	}
}
