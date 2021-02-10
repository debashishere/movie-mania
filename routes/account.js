const router = require('express').Router();;
const controller = require('../controller/dbSupport');
const passport = require('passport');
const { checkNotAuthenticated } = require('../middleware/auth');
const { renderRegisterPage, renderLoginPage } = require('../controller/render');

router
    .route("/register")

    .get(checkNotAuthenticated, (req, res) => {
        renderRegisterPage(res);
    })
    .post(checkNotAuthenticated, (req, res) => {
        controller.createUser(req, res);
    })


router
    .route('/login')

    .get(checkNotAuthenticated, (req, res) => {
        renderLoginPage(res);
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


module.exports = router;