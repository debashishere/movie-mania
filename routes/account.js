const router = require('express').Router();;
const passport = require('passport');
const bcrypt = require('bcrypt');

const { checkNotAuthenticated } = require('../middleware/auth');
const { renderRegisterPage, renderLoginPage } = require('../controller/render');
const { getUserByEmail, createUser } = require('../controller/dbService');



router
    .route("/register")
    .get(checkNotAuthenticated, (req, res) => {
        renderRegisterPage(res);
    })
    .post(checkNotAuthenticated, async (req, res) => {

        try {
            if (req.body) {
                const user = getNewUser(req);
                const err = await validateUser(user);
                if (err) {
                    const data = {
                        errors: err,
                        name: user.name,
                        email: user.email,
                        title: 'Register',
                    }
                    renderRegisterPage(res, data);
                } else {
                    const hashedPassword = await bcrypt.hash(user.password, 10);
                    user.password = hashedPassword;
                    const insertId = await createUser(user);
                    if (insertId) {
                        req.flash('success_msg', 'You are now registered and can login')
                        res.redirect('/account/login')
                    }
                    else {
                        req.flash('error_msg', 'Error While Registratation, Please Try again')
                        res.redirect('/account/register')
                    }
                }
            }
        }

        catch (err) {
            req.flash('error_msg', 'Error While Registratation, Please Try again')
            res.redirect('/account/register')
        }
    })


router
    .route('/login')
    .get(checkNotAuthenticated, (req, res) => {
        renderLoginPage(res);
    })
    .post((req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/favorite',
            failureRedirect: '/account/login',
            failureFlash: true
        })(req, res, next)
    })


router
    .route('/logout')
    .delete((req, res) => {
        req.session.cookie.expires = 30 * 1000 // 30 sec after logout
        req.logout();
        res.redirect('/');
    })


const getNewUser = (req) => {

    const user = {};
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password
    user.password2 = req.body.password2
    return user;

}

const validateUser = async (user) => {

    try {
        let errors = [];
        if (!user.name || !user.email || !user.password || !user.password2) {
            errors.push({ msg: 'Please fill in all fields' })
        }
        if (user.password !== user.password2) {
            errors.push({ msg: 'Password do not matched' });
        }
        const oldUser = await getUserByEmail(user.email);
        if (oldUser) {
            errors.push({ msg: 'Email is already registered' })
        }

        if (errors.length > 0) {
            return errors;

        } else {
            return false;
        }
    }

    catch (err) {
        console.log(err);
        return false;
    }

}

module.exports = router;