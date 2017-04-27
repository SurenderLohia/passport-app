var express = require('express');
var router = express.Router();

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

module.exports = function(passport) {

  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', {
      message: req.flash('message')
    });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
  }));

  /* GET Registration Page */
  router.get('/signup', function(req, res) {
    res.render('register', {
      message: req.flash('message')
    });
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // route for facebook authentication and login
  // different scopes while logging in
  router.get('/login/facebook',
    passport.authenticate('facebook', {
      scope: 'email'
    }));

  // handle the callback after facebook has authenticated the user
  router.get('/login/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/fb-home',
      failureRedirect: '/'
    })
  );

  /* GET Home Page */
  router.get('/home', isAuthenticated, function(req, res) {
    console.log('\n\n\nreq.user.site: ' + req.user.site);
    res.render('home', {
      user: req.user.site
    });
  });

  /* GET Home Page */
  router.get('/fb-home', isAuthenticated, function(req, res) {
    res.render('fb-home', {
      user: req.user.fb
    });
  });

  // route for twitter authentication and login
  // different scopes while logging in
  router.get('/login/twitter',
    passport.authenticate('twitter')
  );

  // handle the callback after facebook has authenticated the user
  router.get('/login/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/twitter-home',
      failureRedirect: '/'
    })
  );

  /* GET Twitter View Page */
  router.get('/twitter-home', isAuthenticated, function(req, res) {
    res.render('twitter-home', {
      user: req.user.twitter
    });
  });

  /* Handle Logout */
  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
}