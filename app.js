require('dotenv').config();
const express = require("express");
const path = require('path');
const app = express();
const favorite = require('./favorite');
const account = require('./account');
const bodyParser = require('body-parser');

const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');

initializePassport(passport);


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

//middleware for allowing cor and preflight request
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//*********-------Passport-----***********
app.use(session({
    //key to encrypt all info
    secret: process.env.SESSION_SECRET,
    // resave session variables if nothing is changed
    resave: false,
    // save empty value in the session
    saveUninitialized: false

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
    next();
})

//*******--------End of Passport --------******


//******----------View-------***********
// handlebars
const expbs = require('express-handlebars');
app.engine('handlebars', expbs(), {
    defaultLayout: 'main'
});
app.set('view engine', 'handlebars');
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/public')));
// app.use("/css", express.static(__dirname + "/public/css"));
//*******----------End of View---------***********



//******---------------ROUTES----------------*******
// favorite route
app.use('/favorite', favorite);

//account route
app.use('/account', account);

// home page
app.get('/', (req, res) => {
    res.render('home', {
        title: 'home',
        style: 'home.css',
        navbar: true,
        footer: true
    })
})


//explore
app.use('/explore', (req, res) => {
    res.render('explore', {
        title: 'explore',
        style: 'explore.css',
        navbar: true,
        footer: true,
    })
})


//about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'about',
        style: 'about.css',
        navbar: true,
        footer: true
    })
})

//********---------End of Routes--------********

app.listen(3000, (err) => {
    if (err) console.log(err)
    console.log('listening on port 3000')
})