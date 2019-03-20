const express = require('express')
const app = express()
const port = 3000
const dashborad = require('./dashboard')
const path = require('path')
var User = require('./models/user')
const cons = require('consolidate')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
var LocalStrategy = require('passport-local').Strategy;
// Conenct to DB
mongoose.connect('mongodb://localhost:27017/barg', {
    useNewUrlParser: true
})



app.engine('dust', cons.dust);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'dust');
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use(session({
    secret: 'config.redisStore.secret',
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())





app.use('/', dashborad)










app.listen(port, () => console.log(`Example app listening on port ${port}!`))