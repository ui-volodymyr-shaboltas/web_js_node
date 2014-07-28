var express = require('express')
  , app = express();
  
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// app.use(app.router);

app.get('/login', function(req, res) {
  res.sendfile('views/login2.html');
});

app.use(passport.initialize());
app.use(passport.session());

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  })
);
 
app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});
 
app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    // Auth Check Logic
  });
}));
app.listen(8080);