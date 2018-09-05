const express = require('express'),
    //fs = require('fs'),
    pg = require('pg'),
    conString = process.env.DATABASE_URL,
    //multer  =  require('multer'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    blogRoutes = require('./routes/blog.js'),
    sectionRoutes = require('./routes/sections.js'),
    adminRoute = require('./routes/admin.js'),
    imageRoutes = require('./routes/images.js'),
    productRoutes = require('./routes/products.js'),
    homeRoute = require('./routes/home.js'),
    workRoute = require('./routes/work.js'),
    storeRoute = require('./routes/store.js'),
    aboutRoute = require('./routes/about.js'),
    UserManager = require('./models/UserStoreManager.js'),
    port = process.env.PORT || 8888,
    currentFile = '',
    app = express();

// Configure emailer
let transport = nodemailer.createTransport(smtpTransport({
    service : "gmail",
    secureConnection : false,
    //port: 587,
    auth : {
        user : "thrushdesignsonline",
        pass : "qnjeu7+GKzZ+[CBz"
    }
}));

// Configure Passport
// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  async function(req, username, password, done) {
    var user = await UserManager.localAuth(username, password);
    if (user)
    {
        console.log("userObj:");
        console.log(user);
        req.session.user = user;
        done(null, user);
    }
    else
    {
        console.log("COULD NOT LOG IN");
        done(null, user);
    }
  }
));

// Use the LocalStrategy within Passport to register/"signup" users.
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    UserManager.localReg(username, password)
    .then(function (user) {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.user = user;
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// Configure Express
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'THE THRUSHinator of a website.',
    name: '?clever_c00000kie_name?',
    proxy: true,
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('port', port);


// Define routes
app.use('/', blogRoutes);
app.use('/', sectionRoutes);
app.use('/', adminRoute);
app.use('/', imageRoutes);
app.use('/', productRoutes);
app.use('/', homeRoute);
app.use('/', workRoute);
app.use('/', storeRoute);
app.use('/', aboutRoute);

app.get('/sendemail', function (req, res) {
    let mailOptions = {
        to: 'sambeckett303@gmail.com',
        //to: 'gaythrush@hotmail.com',
        subject: 'Message from ' + req.query.name + ' (' + req.query.email + ')',
        text: req.query.message
    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.sendStatus(200);
    });
});

app.get('/signin', function(req, res) {
    res.render('signin.html');
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//logs user into the site
app.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/'
  })
);

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res){
  var name = req.session.user.username;
  console.log("LOGGIN OUT " + req.session.user.username)
  req.logout();
  delete req.session.user;
  res.send(200);
});

app.post('/addtocart', function (req,res) {
    if(!req.session.cart)
    {
        //console.log('Initializing cart in post');
        req.session.cart = [];
        req.session.save(function(err) {});
    }
    console.log('adding cart: ' + req.body.id);
    var data = {
        id: parseInt(req.body.id),
        quantity: parseInt(req.body.quantity),
    }
    req.session.cart.push(data);
    req.session.save(function(err) {});
    res.send(200);
});

app.get('/cart', function (req, res) {
    if (req.session.cart == undefined) {
        req.session.cart = [];
        req.session.save(function(err) {});
    }
    var numCartItems = req.session.cart.length;
    res.render('cart.html', { numCartItems: numCartItems, cart: req.session.cart });
});

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});