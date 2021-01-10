const express = require('express');
const controller = require('./controller');
const passport = require('passport');



let router = express.Router();

router
    .route("/register")
    .get(checkNotAuthenticated, (req, res) => {
        res.render('register', {
            title: 'Register',
            style: 'register.css',
            navbar: true,
            footer: true
        })
    })
    .post(checkNotAuthenticated, (req, res) => {
        controller.createUser(req, res);
    })

router
    .route('/login')
    .get(checkNotAuthenticated, (req, res) => {
        res.render('login', {
            title: 'Login',
            navbar: true,
            footer: true,
            style: 'login.css'
        })
    })
    .post(checkNotAuthenticated, (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/favorite',
            failureRedirect: '/account/login',
            failureFlash: true
        })(req, res, next)
    })

router
    .route('/logout')
    .delete((req, res) => {
        req.logout();
        res.redirect('/');
    })


// check not authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next();
}


module.exports = router;