const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user')
var Post = require('./models/post')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now()+'_'+ file.originalname)  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3
  },
  fileFilter: fileFilter
});
var unscape = require('unescape');
// Conenct to DB
mongoose.connect('mongodb://localhost:27017/barg', {
  useNewUrlParser: true
})
const MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/'
const dbName = 'barg';

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false
}));
router.use(cookieParser());


// Express Session
router.use(session({
  name: 'sid',
  saveUninitialized: true,
  resave: true,
  secret: 'sssh, quiet! it\'s a secret!',
  cookie: {
    maxAge: 1000 * 60 * 60 * 1,
    sameSite: true,
    secure: process.env.NODE_ENV === 'production'
  }
}))

// Passport init
router.use(passport.initialize());
router.use(passport.session());

const redirectHome = (req, res, next) => {
  console.log('home', req.session.userId);

  if (!req.session.userId) {
    res.redirect('/');
  } else {
    next();
  }
}


//*صفحه اصلی 
router.get('/', (req, res) => {
  res.render('index')
})

//*صفحه درباره ما 
router.get('/about', (req, res) => {
  res.render('about')
})

//*صفحه بلاگ
router.get('/blog', (req, res) => {
  res.render('blog')
})

//*صفحه بلاگر
router.get('/bloger', redirectHome, (req, res) => {
  res.render('bloger')
})

//*صفحه لاگین 
router.get('/login', (req, res) => {
  res.render('login')
})


//*صفحه پست خاص
router.get('/blog/:path', async (req, res) => {

  // check if req.params.path is a valid URL in DB
  console.log('-----------------------------------');

  console.log('parameter is: ', req.params.path);

  var validUrl = await isValidUrl();
  console.log('validUrl: ', validUrl);
  if (!validUrl) {
    return res.status(404).send('not found');
  }


  function isValidUrl() {
    console.log('function isValidUrl called');
    return new Promise((resolve, reject) => {
      Post.findOne({
        url: req.params.path
      }, function(err, result) {
        if (err) {
          console.log('err in query, false is returned');
          reject(err);
        } else if (!result) {
          console.log('no such url has found! false is returned');
          resolve(false);
        } else {
          console.log('true is returned');
          console.log('the result is: ',result);
          resolve(true);
        }
      })
    })
  }



  Post.find({
    username: "a"
  }, function (err, result) {
    if (err) throw err;

    res.render('blog', {
      post: result[0].url
    })
  });
});


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
        console.log('wrong attempt');
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }

      console.log('one user logged in');
      return done(null, user);
    });
  }
));


router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login'

}), function (req, res) {
  req.session.userId = req.body.username;
  res.redirect('/bloger')
})


router.post('/bloger', redirectHome, upload.single('filename'),(req, res) => {


  new Post({
    username: req.session.userId,
    content: req.body.editor1,
    title: req.body.title,
    category: req.body.category,
    tags: req.body.tags,
    Image:req.file.path,
    url: req.body.url
  }).save(function (err, doc) {

    if (err) res.json(err)
    else res.redirect('/blog')
  })
});








router.post('/logout', (req, res) => {

  req.session.destroy(err => {
    if (err) {
      return res.render('bloger');
    }
    res.clearCookie('sid');

    res.redirect('/');
  });
});

module.exports = router