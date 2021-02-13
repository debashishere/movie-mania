const path = require('path');
const env = process.env.NODE_ENV || 'development';
if (env == 'development') {
    require('dotenv').config({ path: path.resolve(__dirname, './config/config.env') });
}

const express = require("express");
const home = require('./routes/home');
const api = require('./routes/api');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('express-flash');
const methodOverride = require('method-override');
const initializePassport = require('./config/passport-config');
const logger = require('morgan');
const session = require('express-session');

const app = express();
app.set('trust proxy', 1);

app.use(logger('dev'));

initializePassport(passport);

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

//middleware for allowing cor and preflight request
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const sessionStore = require('./config/session-config');

app.use(session({

    key: process.env.COOKIE_NAME,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 60 * 60 * 1000 // 1 hr
    },

}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
//overread post to delete method
app.use(methodOverride('_method'));

//Global variables
app.use((req, res, next) => {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    const loggedUser = req.user || null
    res.locals.loggedUser = loggedUser;
    next();

})


//******----------View-------***********
// handlebars
const expbs = require('express-handlebars');
app.engine('handlebars', expbs(), {
    defaultLayout: 'main'
});

app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, '/public')));


//******---------------ROUTES----------------*******
app.use('/', home);
app.use('/api', api)

const port = process.env.PORT || 3000
app.listen(port, (err) => {
    if (err) console.log(err)
    console.log(`listening on port ${port}`)
})