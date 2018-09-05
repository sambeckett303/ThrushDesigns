// functions.js/
var bcrypt = require('bcryptjs'),
    Q = require('q'),
    pg = require('pg');

//used in local-signup strategy
exports.localReg = function (username, password) {
  var deferred = Q.defer();
  var hash = bcrypt.hashSync(password, 8);
  var conString = process.env.DATABASE_URL || "postgres://tqwjhqduxcgwel:4Lh-vm7wj5p_dCvIrgSBpBZCMG@ec2-54-204-26-8.compute-1.amazonaws.com:5432/derv9vgl14od5h";
  var client = new pg.Client(conString);
  var user =
  {
    username: username
  }
  client.connect();
  var queryString = "insert into users (username, password, admin) values ('" +  username + "', '" + hash + "', false)";
  var query = client.query( queryString );
  query.on("end", function (result) {          
      client.end();
      deferred.resolve(user);
  });
  return deferred.promise;
};

//check if user exists
    //if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
      //if password matches take into website
  //if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = async function (username, password) {
  //var deferred = Q.defer();
  var conString = process.env.DATABASE_URL;
  var client = new pg.Client(conString);
  await client.connect();
  var queryString = "select * from users where username = '" + username + "'";
  var response = await client.query( queryString );
  if (response && response.rows && response.rows.length)
  {
    var user = response.rows[0];
    var hash = user.password;
    if (bcrypt.compareSync(password, hash))
    {
      return user;
    }
    else
    {
      return false;
    }
  }
  else
  {
    return false;
  }
};