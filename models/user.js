var mongodb = require('./db');

function User(user)
{
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback)
{
	var user = {
		name : this.name,
		password : this.password,
		email : this.email
	};
	//open the db
	mongodb.open(function(err, db){
		console.log('open mongodb');
		if (err)
		{
			return callback(err); //return error message
		}
		db.collection('users', function (err, collection){
			if (err)
			{
				mongodb.close();
				return callback(err);
			}

			collection.insert(
				user, 
				{safe : true}, 
				function (err, user)
				{
					mongodb.close();
					if (err)
					{
						return callback(err);
					}
					callback(null, user[0]);//success, return the user
				}
			);
		});
	});
};


User.get = function(name, callback)
{
	console.log('start to find user..');
	mongodb.open(function(err, db){
		if (err)
		{
			console.log(err);
			return callback(err);
		}
		//console.log('find user in collection...');
		db.collection('users', function(err, collection){
			//console.log(collection);
			if (err)
			{
				mongodb.close();
				return callback(err);
			}
			console.log('find user by name: ' + name);
			collection.findOne(
				{name : name}, 
				function(err, user)
				{
					mongodb.close();
					if (err)
					{
						console.log(err);
						return callback(err);
					}
					callback(null, user);
				}
			);
		});
	});
};
