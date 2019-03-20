const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// Conenct to DB
mongoose.connect('mongodb://localhost:27017/barg', {
  useNewUrlParser: true
})

router.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false
}));
router.use(cookieParser());


// Express Session
router.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
// Passport init
router.use(passport.initialize());
router.use(passport.session());

//*صفحه اصلی 
router.get('/', (req, res) => {
  res.render('index')
})

//*صفحه درباره ما 
router.get('/about', (req, res) => {
  res.render('about')
})


//*صفحه لاگین 
router.get('/login', (req, res) => {
  res.render('login')
})


passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user)
})

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    });
  }
));


router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'

}), function (req, res) {
  res.send('hey')
})



module.exports = router