module.exports = {

    checkNotAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next();
    },

    checkAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        console.log("not auth")
        req.flash('error_msg', 'Please Login to manage your Favorite Movies')
        res.redirect('/account/login');
    },

    checkApiAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        res.status(401).send("Unauthenticated")
    }
}