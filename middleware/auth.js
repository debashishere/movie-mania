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
        req.flash('error_msg', 'Please Login to manage your Favorite Movies')
        res.redirect('/account/login');
    }
}